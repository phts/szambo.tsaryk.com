import {Route} from '..'
import {login} from './login'
import {home, Data} from './home'

const CHART_MAX_VALUES = 50

export const getRoot: Route =
  ({config, services}) =>
  async (req, res) => {
    if (!req.query.auth) {
      res.send(login())
      return
    }
    const page: Data = {
      levels: [],
      logs: [],
      chart: {data: []},
      remoteControlHref: `/remote-control?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      scheduledActionsHref: `/scheduled-actions?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      levelsHref: `/levels?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      logsHref: `/logs?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      freq1Href: `/?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      freq2Href: `/?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}&freq=2`,
      freq3Href: `/?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}&freq=3`,
      freq4Href: `/?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}&freq=4`,
      isAdmin: req.query.auth_wr === config.auth.wr,
      warningLevel: config.levels.warningAt,
      authWr: req.query.auth_wr?.toString(),
    }
    const freq = parseInt(req.query.freq as string) || 1
    if (freq < 0 || freq > 4) {
      res.sendStatus(400)
      return
    }
    page.levels = await services.levels.toThrottledArray({
      freq,
      limit: 31,
    })
    page.logs = await services.logs.toArray({limit: 40, sort: {when: -1}})
    page.levels.slice(0, CHART_MAX_VALUES).forEach((v) => {
      page.chart.data.unshift({
        x: v.when.toISOString(),
        y: v.value,
        label_m3: typeof v.value_m3 === 'number' ? `${v.value_m3} m³` : '',
        errorRate: typeof v.errorRate === 'number' ? `⚠${v.errorRate}%` : '',
      })
    })
    res.send(home(page))
  }
