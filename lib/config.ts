import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import nodeFetch from 'node-fetch'

function loadEnvLocal(): Record<string, string> {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const content = fs.readFileSync(envPath, 'utf8')
    const result: Record<string, string> = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx < 1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      result[key] = val
    }
    return result
  } catch {
    return {}
  }
}

const _envLocal = loadEnvLocal()

export function getEnv(key: string): string {
  const fromProcess = process.env[key]
  if (fromProcess) return fromProcess
  return _envLocal[key] ?? ''
}

export const OPENAI_API_KEY = getEnv('OPENAI_API_KEY')
export const OPENAI_BASE_URL = getEnv('OPENAI_BASE_URL')
export const CHAT_MODEL = getEnv('CHAT_MODEL') || 'claude-opus-4.6-azure'

// Shared OpenAI client factory with proxy support via node-fetch
export function createOpenAIClient(): OpenAI {
  const apiKey = getEnv('OPENAI_API_KEY')
  const baseURL = getEnv('OPENAI_BASE_URL')
  const proxyUrl = getEnv('HTTPS_PROXY') || getEnv('https_proxy')

  if (proxyUrl) {
    const agent = new HttpsProxyAgent(proxyUrl)
    // node-fetch accepts the agent option and works well with https-proxy-agent
    const proxiedFetch = (url: RequestInfo | URL, init?: RequestInit) =>
      nodeFetch(url as string, { ...(init as object), agent }) as unknown as Promise<Response>

    return new OpenAI({ apiKey, baseURL, fetch: proxiedFetch })
  }

  return new OpenAI({ apiKey, baseURL })
}
