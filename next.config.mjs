/** @type {import('next').NextConfig} */
const nextConfig = {
  // Раскомментировать, если при отправке сообщения будет появляться ошибка websocket
  // webpack: (config) => {
  //   config.externals.push({
  //     'utf-8-validate': 'commonjs utf-8-validate',
  //     bufferutil: 'commonjs bufferutil'
  //   })
  //   return config
  // },
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
