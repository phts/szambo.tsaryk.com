import {ObjectId} from 'mongodb'
import {Route} from '..'
import {LevelMode} from '../../models'

export const postLevel: Route =
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
      services.emails.sendLevelNotification(newValue)
    }
  }

export const deleteLevel: Route =
  ({services}) =>
  async (req, res) => {
    if (typeof req.query.id !== 'string') {
      res.sendStatus(400)
      return
    }
    const level = (await services.levels.toArray({filter: {_id: new ObjectId(req.query.id)}}))[0]
    if (!level) {
      console.warn(`Level with id=${req.query.id} does not exists`)
      res.send({ok: true})
      return
    }
    await services.levels.deleteOne(req.query.id)
    await services.logs.insertOneFromWeb({
      message: `Removed level "${level.value}" (${level.when.toLocaleString()})`,
      severity: 'info',
    })
    res.send({ok: true})
  }
