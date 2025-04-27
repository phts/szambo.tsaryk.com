import * as path from 'path'
import {readFileSync} from 'fs'
import {Level, Log} from '../../db'

export interface Data {
  levels: Level[]
  logs: Log[]
}

const tmpl = readFileSync(path.resolve(__dirname, 'page.tmpl.html')).toString()

const STYLES = {
  warn: 'color:#f60',
  error: 'color:#e00',
  fatal: 'background-color:#f55;color:#000',
}

export function page({levels, logs}: Data, warningLevel: number) {
  const levelsHtml = `<h3>Levels</h3><table class="levels" border=1>
  <tr><th>When</th><th>Value</th></tr>
  ${levels
    .map(({value, when}) => {
      const props = value >= warningLevel ? ` style="${STYLES.warn}"` : ''
      return `<tr${props}><td>${when.toLocaleString()}</td><td>${value}</td></tr>`
    })
    .join('')}
</table>`
  const logsHtml = `<h3>Logs</h3><table class="logs" border=1>
  <tr><th>When</th><th>Severity</th><th>Message</th></tr>
  ${logs
    .map(({message, severity, when}) => {
      const style = STYLES[severity as keyof typeof STYLES]
      const props = style ? ` style="${style}"` : ''
      return `<tr${props}><td>${when.toLocaleString()}</td><td>${severity}</td><td>${message.replaceAll('\n', '<br>')}</td></tr>`
    })
    .join('')}
</table>`
  return tmpl.replace('{{levels}}', levelsHtml).replace('{{logs}}', logsHtml)
}
