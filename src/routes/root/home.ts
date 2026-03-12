import * as path from 'path'
import {readFileSync} from 'fs'
import {levelsTable, LevelViewModel} from '../levels/levelsTable'
import {Health} from '../../services'
import {logsTable, LogViewModel} from '../logs/logsTable'

export interface Data {
  levels: LevelViewModel[]
  logs: LogViewModel[]
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
  authWr?: string
  warningHighErrorRate: number
  warningHighRange: number
  adminModeLinkStyle: string
  deviceHealth: Health
}

const tmpl = readFileSync(path.resolve(__dirname, 'home.tmpl.html')).toString()

export function home({
  levels,
  logs,
  chart: {data: chartData},
  remoteControlHref,
  scheduledActionsHref,
  isAdmin,
  authWr,
  levelsHref,
  logsHref,
  freq1Href,
  freq2Href,
  freq3Href,
  freq4Href,
  warningHighErrorRate,
  warningHighRange,
  adminModeLinkStyle,
  deviceHealth,
}: Data) {
  const healthHtml =
    deviceHealth === Health.OK
      ? '<span title="Device health: OK">☀️</span>'
      : deviceHealth === Health.Unstable
        ? '<span title="Device health: Unstable">⛈️</span>'
        : '<span title="Device health: Partially OK">⛅</span>'
  const adminPanelHtml = isAdmin
    ? `<div>${healthHtml} | <a href="${remoteControlHref}">Remote control</a> | <a href="${scheduledActionsHref}">Scheduled actions</a></div>`
    : healthHtml
  const levelsHtml = levelsTable({
    levels,
    showMode: false,
    showRemove: false,
    showRange: false,
    showDelta: true,
    showErrorRate: false,
    authWr,
    warningHighErrorRate,
    warningHighRange,
  })
  const logsHtml = logsTable({logs})

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
    .replace('{{adminModeLinkStyle}}', adminModeLinkStyle)
}
