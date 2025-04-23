import {Route} from '..'
import {exec, Log} from '../../db'

export const log: Route = () => async (req, res) => {
  const {message, severity} = req.query
  if (
    typeof message !== 'string' ||
    typeof severity !== 'string' ||
    !['debug', 'info', 'warn', 'error'].includes(severity)
  ) {
    res.sendStatus(400)
    return
  }
  await exec<Log>(
    'logs',
    async (collection) => {
      await collection.insertOne({message, severity, when: new Date()})
      res.send({ok: true})
    },
    {
      onError: () => {
        res.sendStatus(503)
      },
    }
  )
}
