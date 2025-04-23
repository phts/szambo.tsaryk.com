import * as path from 'path'
import {readFileSync} from 'fs'
import {Level, Log} from '../../db'

interface Args {
  levels: Level[]
  logs: Log[]
}

const tmpl = readFileSync(path.resolve(__dirname, 'page.tmpl.html')).toString()

const COLORS = {
  warn: '#f60',
  error: '#e00',
}

export function page({levels, logs}: Args, warningLevel: number) {
  const levelsHtml = `<h3>Levels</h3><table border=1>
  <tr><th>When</th><th>Value</th></tr>
  ${levels
    .map(({value, when}) => {
      const style = value >= warningLevel ? ` style="color:${COLORS.warn}"` : ''
      return `<tr${style}><td>${when.toLocaleString()}</td><td>${value}</td></tr>`
    })
    .join('')}
</table>`
  const logsHtml = `<h3>Logs</h3><table border=1>
  <tr><th>When</th><th>Severity</th><th>Message</th></tr>
  ${logs
    .map(({message, severity, when}) => {
      const color = COLORS[severity as keyof typeof COLORS]
      const style = color ? ` style="color:${color}"` : ''
      return `<tr${style}><td>${when.toLocaleString()}</td><td>${severity}</td><td>${message}</td></tr>`
    })
    .join('')}
</table>`
  return tmpl.replace('{{levels}}', levelsHtml).replace('{{logs}}', logsHtml)
}
