import {Route} from '..'
import {exec, Level, Log} from '../../db'
import {page, Data} from './page'

export const root: Route =
  ({config}) =>
  async (req, res) => {
    const pagedata: Data = {levels: [], logs: []}
    const limit = req.query.all ? 1000 : 10
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

    res.send(page(pagedata, config.warningLevel))
  }
