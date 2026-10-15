/** @type {import('next').NextConfig} */
// Every image now lives in public/, so there are no remotePatterns: /_next/image refuses all
// remote URLs and can't be used to proxy arbitrary images through this server.
const nextConfig = {};

export default nextConfig;
