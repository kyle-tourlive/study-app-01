import { supabase } from '@/lib/supabase';
import TourDetailClient from '@/components/TourDetailClient';

export default async function TourPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Fetch tour
    const { data: tour, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

    // Fetch tracks
    const { data: tracks, error: tracksError } = await supabase
        .from('tour_tracks')
        .select('*')
        .eq('tour_id', id)
        .order('index', { ascending: true });

    // Use fallback data ONLY if DB fetch fails or returns empty
    const safeTour = tour || {
        id: id,
        name: 'Sample Tour Detail',
        sub_name: 'Database not connected yet',
        thumbnail: 'https://static.tourlive.co.kr/static/tour/2026/02/03/thumb/d3caaefa00d811f1b4ce3e8cbb4a2619/image/1770106669_HGvNy.png',
        description: 'Please run the migrate script.'
    };

    let finalTracks = [];
    if (tracksError) {
        // DB 에러 시 하드코딩 샘플 데이터 제공
        finalTracks = [
            { id: 13346, name: '인삿말 (Sample)', play_time: '01:44', media_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', is_sample: true }
        ];
    } else if (tracks && tracks.length > 0) {
        // 실제 DB에서 가져온 트랙들 중 is_sample이 true인 트랙만 재생 목록에 노출
        finalTracks = tracks.filter(track => track.is_sample === true);
    } else {
        // DB 연동은 성공했으나, 해당 투어에 트랙이 없는 경우
        finalTracks = [];
    }

    return <TourDetailClient tour={safeTour} tracks={finalTracks} />;
}
