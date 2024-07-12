#!/usr/bin/env node

import { CoreMessage, generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import * as fs from 'node:fs'
import { prompt } from './src/prompt'
import * as console from 'node:console'
import * as process from 'node:process'
import prompts, { PromptObject } from 'prompts'

const callAI = async (messages: Array<CoreMessage>) => {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: prompt(),
    messages: messages,
    temperature: 0.8,
    maxTokens: 4096
  })

  return text
}

const main = async () => {
  process.stdout.write(
    `🤖 Hola, soy tu \x1b[34masistente de IA\x1b[0m para ayudarte a traducir fichero de traduciones a cualquier idioma\n`
  )

  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'meaning',
      message: 'Dime el path absoluto del fichero que quieres traducir'
    },
    {
      type: 'select',
      name: 'language',
      message: 'Selecione el lenguage de traduccion',
      choices: [
        { title: 'Inglés', value: 'ingles' },
        { title: 'Español', value: 'español' },
        { title: 'Frances', value: 'frances' },
        { title: 'Italiano', value: 'italiano' },
        { title: 'Portugués', value: 'portugues' },
        { title: 'Ruso', value: 'ruso' },
        { title: 'Chino', value: 'chino' },
        { title: 'Japonés', value: 'japonés' },
        { title: 'Coreano', value: 'coreano' },
        { title: 'Turco', value: 'turco' },
        { title: 'Polaco', value: 'polaco' },
        { title: 'Holandés', value: 'holandés' },
        { title: 'Finlandés', value: 'finlandés' },
        { title: 'Noruego', value: 'noruego' },
        { title: 'Danés', value: 'danés' },
        { title: 'Sueco', value: 'sueco' }
      ]
    },
    {
      type: 'confirm',
      name: 'preview',
      message: 'Quieres ver un preview antes de guardar el fichero?',
      initial: true
    }
  ]

  const { meaning, language, preview } = await prompts(questions)

  if (!fs.existsSync(meaning)) {
    process.stderr.write(`🤖 El fichero ${meaning} no existe\n`)
    process.exit(1)
  }

  process.stdout.write(
    `🤖 Traduciendo el fichero \x1b[34m${meaning}\x1b[0m que se traducirá a \x1b[34m${language}\x1b[0m y${preview ? ' ' : ' no '}se generará una \x1b[34mpreview\x1b[0m\n`
  )

  const buffer = fs.readFileSync(meaning)

  const firstCall = await callAI([
    { role: 'user', content: buffer.toString() },
    { role: 'user', content: meaning },
    { role: 'user', content: language }
  ])

  const { translate, fileName } = JSON.parse(firstCall)
  const translated = JSON.parse(translate)

  if (preview) {
    process.stdout.write(`${JSON.stringify(translated, null, 2)}\n`)

    const { isCorrect } = await prompts({
      type: 'confirm',
      name: 'isCorrect',
      message: 'La tradución es correcta y quieres almacenarla?',
      initial: true
    })
    if (!isCorrect) return
  }

  fs.writeFileSync(fileName, JSON.stringify(translated, null, 2))

  process.stdout.write(`🤖 El fichero se ha almacenado en \x1b[34m${fileName}\x1b[0m\n`)
}

main().catch(console.error)
