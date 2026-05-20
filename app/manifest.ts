import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pulse',
    short_name: 'Pulse',
    description: 'Your daily operating system',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0f0f0f',
    icons: [
      { src: '/pulse-logo.jpg', sizes: 'any', type: 'image/jpeg' },
    ],
  };
}
