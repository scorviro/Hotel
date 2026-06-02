/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: ['*.ngrok-free.app', 'a047-2401-4900-361f-5afe-ea40-f88b-c9c6-78a5.ngrok-free.app'],
  async rewrites() {
    return [
      {
        source: '/gallery/:path*',
        destination: '/gallary/:path*',
      },
    ];
  },
};

export default nextConfig;
