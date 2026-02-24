import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    console.log('🔄 Starting data migration...');

    try {
        // 1. Fetch tours (v1 API with tour_media=1 for audio only tours)
        const toursResponse = await fetch('https://api.tourlive.co.kr/v1/tours?page_size=10&tour_media=1');
        const toursData = await toursResponse.json();

        if (!toursData.success) throw new Error('Failed to fetch tours');

        const tours = toursData.data.results.map(t => ({
            id: t.id,
            name: t.name,
            sub_name: t.sub_name,
            thumbnail: t.thumbnail,
            created_at: t.created_at,
        }));

        // Insert tours
        const { error: toursError } = await supabase.from('tours').upsert(tours);
        if (toursError) throw toursError;
        console.log(`✅ Migrated ${tours.length} tours (audio only).`);

        // We explicitly add tour 1267 since the user wants its sample track (13346)
        const specificTourResp = await fetch('https://api.tourlive.co.kr/v1/tours/1267');
        const specificTourData = await specificTourResp.json();

        let toursToMigrateTracks = tours.slice(0, 5);
        if (specificTourData.success && specificTourData.data) {
            const t1267 = specificTourData.data;
            await supabase.from('tours').upsert({
                id: t1267.id,
                name: t1267.name,
                sub_name: t1267.sub_name,
                thumbnail: t1267.thumbnail,
                created_at: t1267.created_at,
            });
            console.log(`✅ Migrated explicitly requested tour 1267.`);
            // Add to tracks fetch queue if not already there
            if (!toursToMigrateTracks.find(t => t.id === 1267)) {
                toursToMigrateTracks.push(t1267);
            }
        }

        for (const tour of toursToMigrateTracks) {
            // Use v4 for tracks fetching as it works properly and we know the schema
            const tracksResponse = await fetch(`https://api.tourlive.co.kr/v4/tours/${tour.id}/tour_tracks`);
            const tracksData = await tracksResponse.json();

            if (tracksData.success && tracksData.data.length > 0) {
                const tracks = tracksData.data.map(track => ({
                    id: track.id,
                    tour_id: track.tour,
                    name: track.name,
                    thumbnail: track.track_images?.[0]?.image || null,
                    media_url: track.video_track_file || track.track_file || null,
                    play_time: track.play_time,
                    index: track.index,
                    is_sample: track.is_sample_file || track.id === 13346 || false,
                    created_at: track.created_at
                }));

                const { error: tracksError } = await supabase.from('tour_tracks').upsert(tracks);
                if (tracksError) throw tracksError;
                console.log(`✅ Migrated ${tracks.length} tracks for tour ${tour.id}.`);
            } else {
                console.log(`⚠️ No tracks found for tour ${tour.id}, skipping tracks migration for this tour.`);
            }
        }

        console.log('✨ Migration complete!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    }
}

migrateData();
