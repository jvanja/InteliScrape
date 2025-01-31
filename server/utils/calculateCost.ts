interface OpenAIUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens?: number
}

/**
 * Pricing per 1,000,000 tokens (USD).
 */
interface ModelCost {
  // Cost for prompt tokens per 1,000,000 tokens
  prompt: number

  // Cost for completion tokens per 1,000,000 tokens
  completion: number
}

const costMap: Record<string, ModelCost> = {
  'gpt-4o-mini-2024-07-18': { prompt: 0.15, completion: 0.6 },
}

/**
 * Calculates the approximate cost in USD for a single OpenAI API request,
 * based on usage (prompt + completion tokens) and a per-1M-token rate.
 *
 * @param model - The OpenAI model name (e.g., "gpt-3.5-turbo" or "gpt-4o-mini-2024-07-18")
 * @param usage - The token usage object from the OpenAI response
 * @returns The cost in USD for this request
 */
export default function (model: string, usage: OpenAIUsage): number {
  const { prompt_tokens, completion_tokens } = usage

  const modelCost = costMap[model]
  if (!modelCost) {
    console.warn(`Unknown model: ${model}. No cost data available.`)
    return 0
  }

  // Convert tokens to cost using a rate per 1,000,000 tokens
  const promptCost = (prompt_tokens / 1000000) * modelCost.prompt
  const completionCost = (completion_tokens / 1000000) * modelCost.completion

  // Combine and round to a reasonable precision
  return +(promptCost + completionCost).toFixed(6)
}
