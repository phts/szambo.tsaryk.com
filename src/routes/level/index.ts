import {Route} from '..'
import {exec, Level, LevelMode} from '../../db'
import {email} from './email'

export const level: Route =
  ({config}) =>
  async (req, res) => {
    const newValue = parseInt(req.query.value as string)
    if (isNaN(newValue)) {
      res.sendStatus(400)
      return
    }
    const mode = req.query.mode === 'auto' ? LevelMode.Auto : LevelMode.Manual
    await exec<Level>('levels', async (collection) => {
      await collection.insertOne({value: newValue, mode, when: new Date()})
      res.send({ok: true})
    })
    if (newValue >= config.warningLevel) {
      email({config: config.email, level: newValue})
    }
  }
