/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image only optimises remote images from hosts listed here, so /_next/image can't be
    // used to proxy arbitrary URLs through our server. The one remote image is the home hero
    // from Wikimedia Commons, pinned to its own folder.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/9/96/**',
      },
    ],
  },
};

export default nextConfig;
