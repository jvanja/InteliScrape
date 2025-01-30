// server/api/ai.post.ts

import { H3Event } from "h3";
import OpenAI from "openai";
import GPT3Tokenizer from "gpt-3-encoder";

// This example uses the standard "text-davinci-003" or "gpt-3.5-turbo" model.
// You can switch to any other model or even a different provider.
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // 1. Parse the incoming request body
    // Expect: { text: string, prompt: string }
    const { scrapedPages, prompt } = await readBody(event);
    const results: Array<{
      url: string;
      result?: string;
      error?: string;
    }> = [];

    if (!scrapedPages || !prompt) {
      console.error("Missing required fields: scrapedPages or prompt");
      return {
        success: false,
        data: [],
        error: "Missing required field: prompt",
      };
    }

    for (const page of scrapedPages) {
      const response = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert data parser. Extract the required information as specified by the user.",
          },
          {
            role: "user",
            content: `Context text:\n${page.html}\n\nUser Prompt:\n${prompt}`,
          },
        ],
        model: "gpt-4o-mini-2024-07-18",
        // max_tokens: 300,
        temperature: 0,
      });
      // // 3. Extract the assistant's reply.
      const aiMessage = response.choices?.[0]?.message?.content || "";
      results.push({ url: page.url, result: aiMessage });
      // results.push({ url: page.url, result: 'mock response' });
    }

    // 4. Return the AI-generated text
    return {
      success: true,
      data: results,
    };
  } catch (err: any) {
    // Return error for debugging
    return {
      success: false,
      error: err.message || "AI request failed.",
    };
  }
});

/**
 * Counts the approximate number of tokens in a given string
 * using a GPT-3 style tokenizer.
 *
 * @param text The input string to tokenize
 * @returns Number of tokens
 */
export function countTokens(text: string): number {
  // Create an instance of the tokenizer
  const encoded = GPT3Tokenizer.encode(text);
  return encoded.length;
}
