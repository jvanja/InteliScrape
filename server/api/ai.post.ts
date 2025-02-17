import type { H3Event } from 'h3'
import client from './ai-openai-client'

export default defineEventHandler(async (event: H3Event) => {
  const { scrapedPages, prompt } = await readBody(event)
  if (!scrapedPages || !prompt) {
    console.error('Missing required fields: scrapedPages or prompt')
    return {
      success: false,
      data: [],
      error: 'Missing required field: prompt',
      totalCost: 0,
    }
  }
  return await client(scrapedPages, prompt)
})
