import {Route} from '..'
import {exec, Level, Log} from '../../db'
import {login} from './login'
import {page, Data} from './page'

const CHART_MAX_VALUES = 10

export const root: Route =
  ({config}) =>
  async (req, res) => {
    if (!req.query.auth) {
      res.send(login())
      return
    }
    const pagedata: Data = {levels: [], logs: [], chart: {labels: [], data: []}}
    const limit = req.query.full ? 1000 : 10
    await exec<Level>(
      'levels',
      async (collection) => {
        const cursor = collection.find().sort({when: -1}).limit(limit)
        pagedata.levels = await cursor.toArray()
      },
      {
        onError: () => {
          res.sendStatus(503)
        },
      }
    )
    await exec<Log>(
      'logs',
      async (collection) => {
        const cursor = collection.find().sort({when: -1}).limit(limit)
        pagedata.logs = await cursor.toArray()
      },
      {
        onError: () => {
          res.sendStatus(503)
        },
      }
    )
    pagedata.levels.slice(0, CHART_MAX_VALUES).forEach((v) => {
      pagedata.chart.data.unshift(v.value)
      pagedata.chart.labels.unshift(v.when.toLocaleString())
    })
    res.send(page(pagedata, config.warningLevel))
  }
