import {Route} from '..'
import {exec, Level, Log} from '../../db'
import {page} from './page'

export const root: Route = () => async (req, res) => {
  const pagedata: {levels: Level[]; logs: Log[]} = {levels: [], logs: []}
  await exec<Level>(
    'levels',
    async (collection) => {
      const cursor = collection.find().sort({when: -1})
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
      const cursor = collection.find().sort({when: -1})
      pagedata.logs = await cursor.toArray()
    },
    {
      onError: () => {
        res.sendStatus(503)
      },
    }
  )

  res.send(page(pagedata))
}
