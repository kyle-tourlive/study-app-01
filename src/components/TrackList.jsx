'use client';

export default function TrackList({ tracks, currentTrackId, onPlay }) {
    if (!tracks || tracks.length === 0) return <p style={{ color: '#9ca3af' }}>No tracks available.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tracks.map((track) => {
                const isActive = currentTrackId === track.id;

                return (
                    <div
                        key={track.id}
                        onClick={() => onPlay(track)}
                        className={`glass-panel transition-smooth`}
                        style={{
                            display: 'flex',
                            padding: '16px',
                            gap: '20px',
                            cursor: 'pointer',
                            alignItems: 'center',
                            border: isActive ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                            background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'var(--glass-bg)',
                            boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                            transform: isActive ? 'scale(1.01)' : 'scale(1)'
                        }}
                    >
                        {/* Play Icon / Number */}
                        <div style={{ width: '32px', textAlign: 'center', color: isActive ? 'var(--primary)' : '#6b7280', fontWeight: '600' }}>
                            {isActive ? '▶' : track.index || '-'}
                        </div>

                        {/* Thumbnail */}
                        {track.thumbnail && (
                            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                <img src={track.thumbnail} alt={track.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}

                        {/* Info */}
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '4px', color: isActive ? 'var(--primary)' : 'inherit' }}>{track.name}</h4>
                            {track.play_time && <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{track.play_time}</span>}
                        </div>

                        <div style={{ color: isActive ? 'var(--primary)' : '#9ca3af', opacity: isActive ? 1 : 0.5 }}>
                            재생
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
