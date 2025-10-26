import * as path from 'path'
import {readFileSync} from 'fs'
import {Level, LevelMode, Log} from '../../models'
import {getLevelsTableHtml} from '../levels/levelsPage'
import {getLogsTableHtml} from '../logs/logsPage'

export interface Data {
  levels: Level[]
  logs: Log[]
  chart: {
    data: Array<{x: string; y: number; mode: LevelMode; label_m3: string; errorRate: string}>
  }
  remoteControlHref: string
  scheduledActionsHref: string
  levelsHref: string
  logsHref: string
  showMode: boolean
  isAdmin: boolean
  warningLevel: number
  authWr?: string
}

const tmpl = readFileSync(path.resolve(__dirname, 'home.tmpl.html')).toString()

export function home({
  levels,
  logs,
  chart: {data: chartData},
  remoteControlHref,
  scheduledActionsHref,
  showMode,
  isAdmin,
  warningLevel,
  authWr,
  levelsHref,
  logsHref,
}: Data) {
  const adminPanelHtml = isAdmin
    ? `<div><a href="${remoteControlHref}">Remote control</a> | <a href="${scheduledActionsHref}">Scheduled actions</a></div><hr>`
    : ''
  const levelsHtml = getLevelsTableHtml({levels, showMode, isAdmin, warningLevel, authWr})
  const logsHtml = getLogsTableHtml({logs})

  return tmpl
    .replace('{{adminPanel}}', adminPanelHtml)
    .replace('{{levels}}', levelsHtml)
    .replace('{{logs}}', logsHtml)
    .replace("'{{chartData}}'", JSON.stringify(chartData))
    .replace('{{levelsHref}}', levelsHref)
    .replace('{{logsHref}}', logsHref)
}
