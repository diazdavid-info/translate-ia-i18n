import fs from 'node:fs'

export const read = (path: string) => {
  const buffer = fs.readFileSync(path)
  return buffer.toString()
}

export const write = (path: string, content: string) => {
  fs.writeFileSync(path, content)
}
