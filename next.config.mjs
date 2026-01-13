import { withVercelToolbar } from "@vercel/toolbar/plugins/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    useCache: true,
  },
}

export default withVercelToolbar({ enableInProduction: true })(nextConfig)
