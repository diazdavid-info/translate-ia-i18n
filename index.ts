#!/usr/bin/env node

import { log, blue } from '@/logger'
import { call as callAI } from '@/ai'
import { read as readFile, write as writeFile } from '@/file'
import * as fs from 'node:fs'
import * as console from 'node:console'
import prompts, { PromptObject } from 'prompts'

const handleSigTerm = () => {
  log('🤖 Saliendo...')
  process.exit(0)
}

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const initQuestions = async () => {
  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'meaning',
      message: 'Dime el path absoluto del fichero que quieres traducir',
      validate: (value) => (fs.existsSync(value) ? true : 'El fichero no existe'),
      onState: ({ aborted }) => aborted && process.exit(0)
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
      ],
      onState: ({ aborted }) => aborted && process.exit(0)
    },
    {
      type: 'confirm',
      name: 'preview',
      message: 'Quieres ver un preview antes de guardar el fichero?',
      initial: true,
      onState: ({ aborted }) => aborted && process.exit(0)
    }
  ]

  return prompts(questions)
}

const confirmQuestions = async () => {
  return prompts({
    type: 'confirm',
    name: 'isCorrect',
    message: 'La tradución es correcta y quieres almacenarla?',
    initial: true,
    onState: ({ aborted }) => aborted && process.exit(0)
  })
}

const main = async () => {
  log(`🤖 Hola, soy tu ${blue('asistente de IA')} para ayudarte a traducir fichero de traduciones a cualquier idioma`)

  const { meaning, language, preview } = await initQuestions()

  log(
    `🤖 Traduciendo el fichero ${blue(meaning)} que se traducirá a ${blue(language)} y${preview ? ' ' : ' no '}se generará una ${blue('preview')}`
  )

  const contentFile = readFile(meaning)

  const firstCall = await callAI([
    { role: 'user', content: contentFile },
    { role: 'user', content: meaning },
    { role: 'user', content: language }
  ])

  const { translate, fileName } = JSON.parse(firstCall)
  const translateFormated = JSON.stringify(JSON.parse(translate), null, 2)

  if (preview) {
    log(translateFormated)

    const { isCorrect } = await confirmQuestions()

    if (!isCorrect) return
  }

  writeFile(fileName, translateFormated)

  log(`🤖 El fichero se ha almacenado en ${blue(fileName)}`)
}

main().catch(console.error)
