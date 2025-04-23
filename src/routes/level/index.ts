import {Route} from '..'
import {exec, Level} from '../../db'
import {email} from './email'

export const level: Route =
  ({config}) =>
  async (req, res) => {
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
    if (newValue >= config.warningLevel) {
      email({config: config.email, level: newValue})
    }
  }
