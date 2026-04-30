// Next.js instrumentation file - runs once on server startup (Node.js runtime only)
// Sets up the corporate proxy so Node.js fetch can reach internal Bayer endpoints

export async function register() {
  // Only run in Node.js runtime, not Edge
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const fs = (await import('fs')).default
    const path = (await import('path')).default

    // Load .env.local manually so proxy vars are available before any imports
    try {
      const envPath = path.join(process.cwd(), '.env.local')
      const content = fs.readFileSync(envPath, 'utf8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx < 1) continue
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim()
        if (!process.env[key]) process.env[key] = val
      }
    } catch {
      // ignore if .env.local not found
    }

    // Set proxy env vars so Node.js undici/fetch picks them up
    const proxy = process.env.HTTPS_PROXY || process.env.https_proxy
    if (proxy) {
      process.env.HTTPS_PROXY = proxy
      process.env.https_proxy = proxy
      process.env.HTTP_PROXY = proxy
      process.env.http_proxy = proxy
      const noProxy = process.env.NO_PROXY || process.env.no_proxy || 'localhost,127.0.0.1'
      process.env.NO_PROXY = noProxy
      process.env.no_proxy = noProxy
      console.log(`[proxy] Configured: ${proxy}`)
    }
  }
}
