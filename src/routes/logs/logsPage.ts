import * as path from 'path'
import {readFileSync} from 'fs'
import {Log, Source} from '../../models'

const tmpl = readFileSync(path.resolve(__dirname, 'logs.tmpl.html')).toString()

export interface LogsPageData {
  logs: Log[]
}

const LOG_SOURCE_TO_ELEMENT = {
  [Source.Device]: '<span title="Device">📡</span>',
  [Source.Web]: '<span title="Web">🌐</span>',
}

export function getLogsTableHtml({logs}: {logs: Log[]}) {
  return `<table class="logs" border=1>
  <tr><th>When</th><th>Severity</th><th>Source</th><th>Message</th></tr>
  ${logs
    .map(({message, severity, source, when}) => {
      const sourceEl = LOG_SOURCE_TO_ELEMENT[source] || ''
      return `<tr class="${severity}"><td>${when.toLocaleString('ru')}</td><td>${severity}</td><td>${sourceEl}</td><td>${message.replaceAll('\n', '<br>')}</td></tr>`
    })
    .join('')}
</table>`
}

export function logsPage(data: LogsPageData) {
  return tmpl.replace('{{logs}}', getLogsTableHtml(data))
}
