'use client';

import { useState } from 'react';
import TrackList from './TrackList';
import AudioPlayer from './AudioPlayer';

export default function TourDetailClient({ tour, tracks }) {
    const [currentTrack, setCurrentTrack] = useState(tracks?.[0] || null);

    return (
        <div style={{ paddingBottom: '120px' }}>
            {/* Tour Header Info */}
            <section style={{ marginBottom: '40px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '300px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--secondary)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    {tour.thumbnail && (
                        <img src={tour.thumbnail} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                </div>

                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', lineHeight: 1.2 }}>{tour.name}</h1>
                    {tour.sub_name && <h2 style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '16px' }}>{tour.sub_name}</h2>}
                    <p style={{ color: '#d1d5db', lineHeight: 1.6 }}>{tour.description || '작품에 대한 설명과 생생한 오디오 가이드를 즐겨보세요.'}</p>
                </div>
            </section>

            {/* Tracks Section */}
            <section>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>트랙 목록 ({tracks?.length || 0})</h3>
                <TrackList
                    tracks={tracks}
                    currentTrackId={currentTrack?.id}
                    onPlay={(track) => setCurrentTrack(track)}
                />
            </section>

            {/* Sticky Bottom Player */}
            {currentTrack && (
                <AudioPlayer track={currentTrack} onNext={() => {
                    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
                    if (currentIndex < tracks.length - 1) {
                        setCurrentTrack(tracks[currentIndex + 1]);
                    }
                }} />
            )}
        </div>
    );
}
