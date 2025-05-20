import * as path from 'path'
import {readFileSync} from 'fs'
import {Level, Log} from '../../db'

export interface Data {
  levels: Level[]
  logs: Log[]
  chart: {
    labels: string[]
    data: number[]
  }
  remoteControlHref: string
  showMode: boolean
}

const tmpl = readFileSync(path.resolve(__dirname, 'home.tmpl.html')).toString()

const STYLES = {
  warn: 'color:#f60',
  error: 'color:#e00',
  fatal: 'background-color:#f55;color:#000',
}

export function home(
  {levels, logs, chart: {labels: chartLabels, data: chartData}, remoteControlHref, showMode}: Data,
  warningLevel: number
) {
  const levelsHtml = `<h3>Levels</h3><table class="levels" border=1>
  <tr><th>When</th><th>Value</th>${showMode ? '<th>Mode</th>' : ''}</tr>
  ${levels
    .map(({value, when, mode}) => {
      const props = value >= warningLevel ? ` style="${STYLES.warn}"` : ''
      return `<tr${props}><td>${when.toLocaleString()}</td><td>${value}</td>${showMode ? `<td>${mode}</td>` : ''}</tr>`
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
  return tmpl
    .replace('{{levels}}', levelsHtml)
    .replace('{{logs}}', logsHtml)
    .replace('{{remoteControlHref}}', remoteControlHref)
    .replace("'{{chartLabels}}'", JSON.stringify(chartLabels))
    .replace("'{{chartData}}'", JSON.stringify(chartData))
}
