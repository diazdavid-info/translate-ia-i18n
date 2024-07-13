export const log = (value: string) => {
  process.stdout.write(`${value}\n`)
}

export const red = (value: string) => {
  return `\x1b[31m${value}\x1b[0m`
}

export const green = (value: string) => {
  return `\x1b[32m${value}\x1b[0m`
}

export const yellow = (value: string) => {
  return `\x1b[33m${value}\x1b[0m`
}

export const blue = (value: string) => {
  return `\x1b[34m${value}\x1b[0m`
}
