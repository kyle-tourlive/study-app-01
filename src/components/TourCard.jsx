import Link from 'next/link';

export default function TourCard({ tour }) {
    return (
        <Link href={`/tours/${tour.id}`} style={{ display: 'block' }}>
            <div
                className="glass-panel hover-scale"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '280px',
                    height: '340px',
                    overflow: 'hidden',
                    flexShrink: 0
                }}
            >
                <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: 'var(--secondary)' }}>
                    {tour.thumbnail ? (
                        <img
                            src={tour.thumbnail}
                            alt={tour.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : null}
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {tour.name}
                    </h3>
                    {tour.sub_name && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: '#9ca3af',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {tour.sub_name}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
