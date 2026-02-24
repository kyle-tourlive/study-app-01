import { supabase } from '@/lib/supabase';
import TourCard from '@/components/TourCard';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
    // Fetch tours from Supabase
    const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

    // Fallback for visual testing if DB is empty or not connected yet
    const displayTours = tours?.length > 0 ? tours : [
        { id: 1439, name: 'Sample Tour (DB Not Connected)', sub_name: 'Please run DB migration', thumbnail: 'https://static.tourlive.co.kr/static/tour/2026/02/03/thumb/d3caaefa00d811f1b4ce3e8cbb4a2619/image/1770106669_HGvNy.png' },
        { id: 1267, name: 'Sample Tour 2 (DB Not Connected)', sub_name: 'Please run DB migration', thumbnail: 'https://static.tourlive.co.kr/static/tour/2026/02/03/thumb/d3caaefa00d811f1b4ce3e8cbb4a2619/image/1770106669_HGvNy.png' },
        { id: 1, name: 'Sample Tour 3', sub_name: 'Please run DB migration' },
    ];

    return (
        <div>
            <section style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-1px' }}>
                    어디로 떠나볼까요?
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#9ca3af', marginBottom: '32px' }}>
                    당신만의 오디오/비디오 셀프 투어를 시작해보세요.
                </p>

                {error && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                        <p style={{ color: 'var(--accent)' }}>Database Error: {error.message}. Showing sample data.</p>
                    </div>
                )}

                <div
                    className="no-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '24px',
                        overflowX: 'auto',
                        paddingBottom: '24px',
                        paddingTop: '8px',
                        margin: '0 -24px', // Break out of container for full width scroll
                        padding: '8px 24px 32px 24px',
                        scrollSnapType: 'x mandatory'
                    }}
                >
                    {displayTours.map((tour) => (
                        <div key={tour.id} style={{ scrollSnapAlign: 'start' }}>
                            <TourCard tour={tour} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
