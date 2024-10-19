/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        // hostname: '**.example.com',
        port: '',
        search: '',
      },
    ],
  }
};

export default nextConfig;
