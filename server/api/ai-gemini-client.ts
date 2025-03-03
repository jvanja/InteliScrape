import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY']!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export default async (scrapedPages: any[], prompt: string) => {
  const results: Array<{
    url: string
    result?: string
    error?: string
  }> = []
  let totalCost = 0
  const OUTPUT_TOKEN_PRICE = 0.3 // 1 million tokens
  try {
    for (const page of scrapedPages) {
      const task = `You are an expert data parser. Extract the required information from the "Context text"as specified by the user. Be as concise as possible and generate only the data requested using the provided format. Context text:\n${page.html}\n\nUser Prompt:\n${prompt}`
      const result = await model.generateContent(task)
      const costForThisCall = result.response.usageMetadata!.totalTokenCount * OUTPUT_TOKEN_PRICE / 1000000
      totalCost += costForThisCall

      results.push({ url: page.url, result: result.response.text() })
      console.log(result.response.text())
    }
    // Return the final object after processing all pages
    return {
      success: true,
      data: results,
      error: '',
      totalCost: totalCost,
    }
  } catch (err: any) {
    return {
      success: false,
      error: (err.message as string) || 'AI request failed.',
      data: [],
      totalCost: totalCost,
    }
  }
}
