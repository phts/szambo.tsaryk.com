import * as path from 'path'
import {readFileSync} from 'fs'

const tmpl = readFileSync(path.resolve(__dirname, 'login.tmpl.html')).toString()

export function login() {
  return tmpl
}
