'use client';
// Last-resort fallback if the root layout itself fails. Kept dependency-free on purpose.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#faf7f2', color: '#2a2421' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div>
            <h1 style={{ fontWeight: 300, fontSize: '2.6rem', fontFamily: 'Garamond, "Times New Roman", serif' }}>Villa Tanah Shanti</h1>
            <p>Something went wrong while loading the site.</p>
            <p style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => reset()} style={{ minHeight: 48, padding: '0 20px', borderRadius: 2, border: 0, background: '#2e4a2a', color: '#fff', fontWeight: 600 }}>
                Try again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 20px', borderRadius: 2, border: '1px solid #2a2421', color: '#2a2421' }}>
                Home page
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
