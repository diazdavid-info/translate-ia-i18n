import { prompt } from '@/prompt'
import { CoreMessage, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const call = async (messages: Array<CoreMessage>) => {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: prompt(),
    messages: messages,
    temperature: 0.8,
    maxTokens: 4096
  })

  return text
}
