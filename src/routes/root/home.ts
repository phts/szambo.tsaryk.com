import * as path from 'path'
import {readFileSync} from 'fs'
import {Request} from 'express'
import {Level, LevelMode, Log} from '../../models'

export interface Data {
  levels: Level[]
  logs: Log[]
  chart: {
    data: Array<{x: string; y: number; mode: LevelMode}>
  }
  remoteControlHref: string
  scheduledActionsHref: string
  showMode: boolean
  isAdmin: boolean
  warningLevel: number
  query: Request['query']
}

const tmpl = readFileSync(path.resolve(__dirname, 'home.tmpl.html')).toString()

const STYLES = {
  debug: 'opacity:0.5',
  warn: 'color:#f60',
  error: 'color:#e00',
  fatal: 'background-color:#f55;color:#000',
}

export function home({
  levels,
  logs,
  chart: {data: chartData},
  remoteControlHref,
  scheduledActionsHref,
  showMode,
  isAdmin,
  warningLevel,
  query,
}: Data) {
  const adminPanelHtml = isAdmin
    ? `<div><a href="${remoteControlHref}">Remote control</a> | <a href="${scheduledActionsHref}">Scheduled actions</a></div><hr>`
    : ''
  const levelsHtml = `<h3>Levels</h3><table class="levels" border=1>
<tr><th>When</th><th>Value</th>${showMode ? '<th>Mode</th>' : ''}
${isAdmin ? '<th>Remove</th>' : ''}</tr>
  ${levels
    .map(({_id, value, when, mode}) => {
      const props = value >= warningLevel ? ` style="${STYLES.warn}"` : ''
      return `\
<tr${props}>
<td>${when.toLocaleString()}</td>
<td>${value}</td>
${showMode ? `<td>${mode}</td>` : ''}
${isAdmin ? `<td><button onclick='removeLevel(${JSON.stringify(_id)}, ${JSON.stringify(query.auth_wr)})'>×</button></td>` : ''}
</tr>`
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
    .replace('{{adminPanel}}', adminPanelHtml)
    .replace('{{levels}}', levelsHtml)
    .replace('{{logs}}', logsHtml)
    .replace("'{{chartData}}'", JSON.stringify(chartData))
}
