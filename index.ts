#!/usr/bin/env node

import { log, blue } from '@/logger'
import { call as callAI } from '@/ai'
import * as fs from 'node:fs'
import * as console from 'node:console'
import * as process from 'node:process'
import prompts, { PromptObject } from 'prompts'

const main = async () => {
  log(`🤖 Hola, soy tu ${blue('asistente de IA')} para ayudarte a traducir fichero de traduciones a cualquier idioma`)

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
    log(`🤖 El fichero ${meaning} no existe`)
    process.exit(1)
  }

  log(
    `🤖 Traduciendo el fichero ${blue(meaning)} que se traducirá a ${blue(language)} y${preview ? ' ' : ' no '}se generará una ${blue('preview')}`
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
    log(JSON.stringify(translated, null, 2))

    const { isCorrect } = await prompts({
      type: 'confirm',
      name: 'isCorrect',
      message: 'La tradución es correcta y quieres almacenarla?',
      initial: true
    })
    if (!isCorrect) return
  }

  fs.writeFileSync(fileName, JSON.stringify(translated, null, 2))

  log(`🤖 El fichero se ha almacenado en ${blue(fileName)}`)
}

main().catch(console.error)
