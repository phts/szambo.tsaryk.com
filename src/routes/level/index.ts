import {Route} from '..'
import {exec, Level} from '../../db'

export const level: Route = () => async (req, res) => {
  const newValue = parseInt(req.query.value as string)
  if (isNaN(newValue)) {
    res.sendStatus(400)
    return
  }
  await exec<Level>(
    'levels',
    async (collection) => {
      await collection.insertOne({value: newValue, when: new Date()})
      res.send({ok: true})
    },
    {
      onError: () => {
        res.sendStatus(503)
      },
    }
  )
}
