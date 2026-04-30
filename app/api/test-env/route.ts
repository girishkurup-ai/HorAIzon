import { NextResponse } from 'next/server'
import { getEnv } from '@/lib/config'

export async function GET() {
  const key = getEnv('OPENAI_API_KEY')
  const baseUrl = getEnv('OPENAI_BASE_URL')
  const model = getEnv('CHAT_MODEL')
  return NextResponse.json({
    processEnv: process.env.OPENAI_API_KEY ? 'SET' : 'EMPTY',
    configKey: key ? `SET (${key.slice(0, 20)}...)` : 'MISSING',
    baseUrl: baseUrl || 'MISSING',
    model: model || 'MISSING',
  })
}
