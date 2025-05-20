import {Route} from '..'
import {exec, Level, LevelMode, Log} from '../../db'
import {login} from './login'
import {page, Data} from './page'

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
      chart: {labels: [], data: []},
      remoteControlHref: `/remote-control?auth=${config.auth.rd}`,
    }
    await exec<Level>('levels', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (!req.query.manual && !req.query.full) {
        cursor = cursor.filter({mode: LevelMode.Auto})
      }
      if (!req.query.full) {
        cursor = cursor.limit(15)
      }
      pagedata.levels = await cursor.toArray()
    })
    await exec<Log>('logs', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (!req.query.full) {
        cursor = cursor.limit(15)
      }
      pagedata.logs = await cursor.toArray()
    })
    pagedata.levels.slice(0, CHART_MAX_VALUES).forEach((v) => {
      pagedata.chart.data.unshift(v.value)
      pagedata.chart.labels.unshift(v.when.toISOString())
    })
    res.send(page(pagedata, config.warningLevel))
  }
