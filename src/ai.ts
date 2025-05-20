import { prompt } from '@/prompt'
import { CoreMessage, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export const call = async (messages: Array<CoreMessage>) => {
  const { text } = await generateText({
    model: openai('gpt-4.1'),
    system: prompt(),
    messages: messages,
    temperature: 1.0,
    maxTokens: 32768
  })

  return text
}
