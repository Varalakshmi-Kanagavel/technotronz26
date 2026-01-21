/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: ".",
  },
  // Rewrite PayApp callback URL to our verify endpoint
  async rewrites() {
    return [
      {
        source: '/ranleeconfirmation.aspx',
        destination: '/api/payment/verify',
      },
    ]
  },
}

export default nextConfig