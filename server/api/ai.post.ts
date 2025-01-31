// server/api/ai.post.ts

import { H3Event } from "h3";
import OpenAI from "openai";

// This example uses the standard "text-davinci-003" or "gpt-3.5-turbo" model.
// You can switch to any other model or even a different provider.
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    const modelName = "gpt-4o-mini-2024-07-18";
    const { scrapedPages, prompt } = await readBody(event);
    const results: Array<{
      url: string;
      result?: string;
      error?: string;
    }> = [];
    let totalCost = 0;

    if (!scrapedPages || !prompt) {
      console.error("Missing required fields: scrapedPages or prompt");
      return {
        success: false,
        data: [],
        error: "Missing required field: prompt",
        totalCost: 0,
      };
    }

    for (const page of scrapedPages) {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert data parser. Extract the required information as specified by the user. Be as concise as possible and generate only the data requested using the provided format.",
          },
          {
            role: "user",
            content: `Context text:\n${page.html}\n\nUser Prompt:\n${prompt}`,
          },
        ],
        model: modelName,
        max_tokens: 300,
        temperature: 0,
      });
      // // 3. Extract the assistant's reply.
      const aiMessage = response.choices?.[0]?.message?.content || "";
      results.push({ url: page.url, result: aiMessage });
      // results.push({ url: page.url, result: 'mock response' });

      const usage = response.usage!
      const costUSD = calculateCost(modelName, usage);
      console.log(
        `Prompt tokens: ${usage.prompt_tokens}, Completion tokens: ${usage.completion_tokens}`,
      );
      console.log(`Total cost for this request: $${costUSD}`);
      totalCost += costUSD;
    }

    // 4. Return the AI-generated text
    return {
      success: true,
      data: results as [],
      error: '',
      totalCost
    };
  } catch (err: any) {
    // Return error for debugging
    return {
      success: false,
      error: err.message as string || "AI request failed.",
      data: [],
      totalCost: 0
    };
  }
});
