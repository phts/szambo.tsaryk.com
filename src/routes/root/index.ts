import {Route} from '..'
import {exec, Level, LevelMode, Log} from '../../db'
import {login} from './login'
import {home, Data} from './home'

const CHART_MAX_VALUES = 50

export const root: Route =
  ({config}) =>
  async (req, res) => {
    if (!req.query.auth) {
      res.send(login())
      return
    }
    const pagedata: Data = {
      levels: [],
      logs: [],
      chart: {data: []},
      remoteControlHref: `/remote-control?auth=${req.query.auth}&auth_wr=${req.query.auth_wr}`,
      showMode: !!req.query.manual,
      isAdmin: req.query.auth_wr === config.auth.wr,
    }
    await exec<Level>('levels', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (!req.query.manual) {
        cursor = cursor.filter({mode: LevelMode.Auto})
      }
      if (!req.query.more) {
        cursor = cursor.limit(15)
      }
      pagedata.levels = await cursor.toArray()
    })
    await exec<Log>('logs', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (!req.query.more) {
        cursor = cursor.limit(15)
      }
      pagedata.logs = await cursor.toArray()
    })
    pagedata.levels.slice(0, CHART_MAX_VALUES).forEach((v) => {
      pagedata.chart.data.unshift({x: v.when.toISOString(), y: v.value, mode: v.mode})
    })
    res.send(home(pagedata, config.warningLevel))
  }
