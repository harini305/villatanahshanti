export default function manifest() {
  return {
    name: 'Villa Tanah Shanti, Ubud Bali',
    short_name: 'Tanah Shanti',
    description: 'A luxurious, architecturally designed villa with a modern Bali feel.',
    start_url: '/',
    display: 'browser',
    background_color: '#f7f3f0',
    theme_color: '#d4cac5',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
