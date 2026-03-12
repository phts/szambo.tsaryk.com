import * as path from 'path'
import {readFileSync} from 'fs'
import {logsTable, LogViewModel} from './logsTable'

const tmpl = readFileSync(path.resolve(__dirname, 'logs.tmpl.html')).toString()

export interface LogsPageData {
  logs: LogViewModel[]
}

export function logsPage(data: LogsPageData) {
  return tmpl.replace('{{logs}}', logsTable(data))
}
