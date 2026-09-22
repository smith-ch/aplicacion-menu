import type { NextConfig } from 'next';

const API = process.env.API_URL || 'http://localhost:4000';

const nextConfig: NextConfig = {
  // El frontend actúa como proxy del API y de los archivos subidos: evita CORS
  // y permite desplegar ambos detrás de un mismo dominio.
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API}/api/:path*` },
      { source: '/uploads/:path*', destination: `${API}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
