import {Route} from '..'
import {LevelMode} from '../../db'
import {email} from './email'

export const level: Route =
  ({config, services}) =>
  async (req, res) => {
    const newValue = parseInt(req.query.value as string)
    if (isNaN(newValue)) {
      res.sendStatus(400)
      return
    }
    const mode = req.query.mode === 'auto' ? LevelMode.Auto : LevelMode.Manual
    await services.levels.insertOne({value: newValue, mode, when: new Date()})
    res.send({ok: true})

    if (newValue >= config.warningLevel) {
      email({config: config.email, level: newValue})
    }
  }

export const removeLevel: Route =
  ({services}) =>
  async (req, res) => {
    if (typeof req.query.id !== 'string') {
      res.sendStatus(400)
      return
    }
    await services.levels.deleteOne(req.query.id)
    res.send({ok: true})
  }
