'use client';
import { useRef, useState, useEffect } from 'react';

export default function AudioPlayer({ track, onNext }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => {
                console.warn('Auto-play prevented by browser policy', e);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
    }, [track]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.warn('Play error:', e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = window.isNaN(audioRef.current.currentTime) ? 0 : audioRef.current.currentTime;
            const total = window.isNaN(audioRef.current.duration) ? 1 : audioRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const skipRelative = (amount) => {
        if (audioRef.current) {
            audioRef.current.currentTime += amount;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            background: 'rgba(20, 23, 30, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--glass-border)',
            padding: '16px 24px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--secondary)', borderRadius: '2px', overflow: 'hidden', cursor: 'pointer' }} onClick={(e) => {
                if (!audioRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = percent * audioRef.current.duration;
            }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.1s linear' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {/* Track Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    {track.thumbnail ? (
                        <img src={track.thumbnail} alt={track.name} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--secondary)' }} />
                    )}
                    <div>
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: '#fff' }}>{track.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{track.play_time || 'Audio Track'}</div>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => skipRelative(-15)} style={{ color: '#d1d5db', fontSize: '0.9rem', cursor: 'pointer', background: 'var(--secondary)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '44px', height: '44px', transition: 'all 0.2s' }} className="hover-scale">
                        -15s
                    </button>

                    <button
                        onClick={togglePlay}
                        className="hover-scale"
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                            fontSize: '1.5rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>

                    <button onClick={() => skipRelative(15)} style={{ color: '#d1d5db', fontSize: '0.9rem', cursor: 'pointer', background: 'var(--secondary)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '44px', height: '44px', transition: 'all 0.2s' }} className="hover-scale">
                        +15s
                    </button>

                    <button onClick={onNext} style={{ color: '#d1d5db', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none', padding: '8px 12px', borderRadius: 'var(--radius-md)' }} className="glass-panel hover-scale">
                        Next ⏭
                    </button>
                </div>

                <div style={{ flex: 1 }} /> {/* Spacer for centering */}
            </div>

            {track.media_url && (
                <audio
                    ref={audioRef}
                    src={track.media_url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={onNext}
                    style={{ display: 'none' }}
                />
            )}
        </div>
    );
}
