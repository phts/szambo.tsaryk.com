import * as path from 'path'
import {readFileSync} from 'fs'
import {Log} from '../../models'
import {getLogsTableHtml} from '../logs/logsPage'
import {levelsTable, LevelViewModel} from '../levels/levelsTable'

export interface Data {
  levels: LevelViewModel[]
  logs: Log[]
  chart: {
    data: Array<{x: string; y: number; label_m3: string; errorRate: string}>
  }
  remoteControlHref: string
  scheduledActionsHref: string
  levelsHref: string
  logsHref: string
  freq1Href: string
  freq2Href: string
  freq3Href: string
  freq4Href: string
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
  isAdmin,
  warningLevel,
  authWr,
  levelsHref,
  logsHref,
  freq1Href,
  freq2Href,
  freq3Href,
  freq4Href,
}: Data) {
  const adminPanelHtml = isAdmin
    ? `<div><a href="${remoteControlHref}">Remote control</a> | <a href="${scheduledActionsHref}">Scheduled actions</a></div><hr>`
    : ''
  const levelsHtml = levelsTable({levels, showMode: false, isAdmin, warningLevel, authWr})
  const logsHtml = getLogsTableHtml({logs})

  return tmpl
    .replace('{{adminPanel}}', adminPanelHtml)
    .replace('{{levels}}', levelsHtml)
    .replace('{{logs}}', logsHtml)
    .replace("'{{chartData}}'", JSON.stringify(chartData))
    .replace('{{levelsHref}}', levelsHref)
    .replace('{{logsHref}}', logsHref)
    .replace('{{freq1Href}}', freq1Href)
    .replace('{{freq2Href}}', freq2Href)
    .replace('{{freq3Href}}', freq3Href)
    .replace('{{freq4Href}}', freq4Href)
}
