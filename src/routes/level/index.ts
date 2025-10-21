import {ObjectId} from 'mongodb'
import {Route} from '..'
import {LevelMode} from '../../models'

function parseValue(raw?: unknown): {value: number; value_m3: number | null} {
  if (typeof raw !== 'string') {
    throw new Error('parse')
  }
  if (!raw.length) {
    throw new Error('parse')
  }

  const parts = raw.split('|')
  const value = parseInt(parts[0])
  if (isNaN(value)) {
    throw new Error('parse')
  }

  if (parts.length === 1) {
    return {value, value_m3: null}
  }

  const valueM3 = parseFloat(parts[1])
  if (isNaN(valueM3)) {
    return {value, value_m3: null}
  }

  return {value, value_m3: valueM3}
}

export const postLevel: Route =
  ({services}) =>
  async (req, res) => {
    try {
      const {value, value_m3} = parseValue(req.query.value)
      const mode = req.query.mode === 'auto' ? LevelMode.Auto : LevelMode.Manual
      await services.levels.insertOne({value, value_m3, mode, when: new Date()})
      res.send({ok: true})
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e
      }
      if (e.message !== 'parse') {
        throw e
      }
      res.sendStatus(400)
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
