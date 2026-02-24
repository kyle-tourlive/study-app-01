import './globals.css';

export const metadata = {
    title: 'TourLive | Premium Audio Tour',
    description: '오디오/비디오 셀프 투어 서비스',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <main className="container" style={{ paddingBottom: '100px' }}>
                    <header style={{
                        padding: '24px 0',
                        marginBottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <a href="/" style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
                            Tour<span style={{ color: 'var(--primary)' }}>Live</span>
                        </a>
                    </header>
                    {children}
                </main>
            </body>
        </html>
    );
}
