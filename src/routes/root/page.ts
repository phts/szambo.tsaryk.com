import * as path from 'path'
import {readFileSync} from 'fs'
import {Level} from '../../db'

interface Args {
  levels: Level[]
}

const tmpl = readFileSync(path.resolve(__dirname, 'page.tmpl.html')).toString()

export function page({levels}: Args) {
  const levelsHtml = `<table border=1>
  <tr><th>When</th><th>Value</th></tr>
  ${levels.map(({value, when}) => `<tr><td>${when.toLocaleString()}</td><td>${value}</td></tr>`).join('')}
</table>`
  return tmpl.replace('{{levels}}', levelsHtml)
}
