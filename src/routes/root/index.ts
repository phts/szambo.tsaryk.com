import {Route} from '..'
import {exec, Level} from '../../db'
import {page} from './page'

export const root: Route = () => async (req, res) => {
  await exec<Level>(
    'levels',
    async (collection) => {
      const cursor = collection.find().sort({when: -1})
      const levels = await cursor.toArray()
      res.send(page({levels}))
    },
    {
      onError: () => {
        res.sendStatus(503)
      },
    }
  )
}
