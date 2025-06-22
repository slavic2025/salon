import { type NextConfig } from 'next'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // Configurația ta existentă pentru imagini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Funcția pentru antete de securitate și performanță
  async headers() {
    return [
      // --- REGULA NOUĂ PENTRU PERFORMANȚĂ ---
      // Aplicăm antete de caching agresiv pentru resursele statice
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            // public: poate fi stocat de orice cache
            // max-age: 31536000 secunde (1 an)
            // immutable: fișierul nu se va schimba niciodată
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },

      // --- REGULILE DE SECURITATE EXISTENTE ---
      // Aplicăm aceste antete pe toate celelalte rute
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self'`,
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
