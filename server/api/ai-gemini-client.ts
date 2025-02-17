import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY']!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const results: Array<{
  url: string
  result?: string
  error?: string
}> = []

export default async (scrapedPages: any[], prompt: string) => {
  for (const page of scrapedPages) {
    const task = `You are an expert data parser. Extract the required information from the "Context text"as specified by the user. Be as concise as possible and generate only the data requested using the provided format. Context text:\n${page.html}\n\nUser Prompt:\n${prompt}`
    const result = await model.generateContent(task)
    results.push({ url: page.url, result: result.response.text() })
    console.log(result.response.text())
    return result
  }
}
