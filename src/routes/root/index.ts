import {Route} from '..'
import {LevelMode} from '../../models'
import {login} from './login'
import {home, Data} from './home'

const CHART_MAX_VALUES = 50

export const root: Route =
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
      showMode: !!req.query.manual,
      isAdmin: req.query.auth_wr === config.auth.wr,
      warningLevel: config.warningLevel,
      query: req.query,
    }
    page.levels = await services.levels.toArray({
      limit: req.query.more ? undefined : 15,
      filter: req.query.manual ? undefined : {mode: LevelMode.Auto},
    })
    page.logs = await services.logs.toArray({limit: req.query.more ? undefined : 15})
    page.levels.slice(0, CHART_MAX_VALUES).forEach((v) => {
      page.chart.data.unshift({x: v.when.toISOString(), y: v.value, mode: v.mode})
    })
    res.send(home(page))
  }
