/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits a self-contained server for the Docker image.
  output: 'standalone',
}

module.exports = nextConfig
