import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3', 'pdfkit', 'node-fetch', 'https-proxy-agent'],
  allowedDevOrigins: ['debrief-broadness-energetic.ngrok-free.dev', 'atom-sheets-handheld-ski.trycloudflare.com', 'jul-bye-land-gst.trycloudflare.com'],
}

export default nextConfig
