import {Log, Severity, Source} from '../../models'

export interface LogViewModel {
  raw: Log
  message: string
  className: string
  severity: Severity
  source: string
  when: string
}

const LOG_SOURCE_TO_ELEMENT = {
  [Source.Device]: '<span title="Device">🛸</span>',
  [Source.Web]: '<span title="Web">☁️</span>',
}

export function toViewModel(levels: Log[]): LogViewModel[] {
  return levels.reduce((acc, x) => {
    acc.push({
      raw: x,
      className: x.severity,
      message: x.message.replaceAll('\n', '<br>'),
      severity: x.severity,
      source: LOG_SOURCE_TO_ELEMENT[x.source] || '',
      when: x.when.toLocaleString('ru'),
    })
    return acc
  }, [] as LogViewModel[])
}

export function logsTable({logs}: {logs: LogViewModel[]}) {
  return `<table class="logs" border=1>
  <tr><th>When</th><th>Severity</th><th>Source</th><th>Message</th></tr>
  ${logs
    .map(({className, message, severity, source, when}) => {
      return `<tr class="${className}"><td>${when}</td><td>${severity}</td><td>${source}</td><td>${message}</td></tr>`
    })
    .join('')}
</table>`
}
