import {ObjectId} from 'mongodb'
import {Route} from '..'
import {LevelMode, NewLevel, Severity} from '../../models'

class ParseError extends Error {}

function parseNumber(raw?: string) {
  const value = parseFloat(String(raw))
  if (isNaN(value)) {
    return null
  }
  return value
}

function parseValue(raw?: unknown): Pick<NewLevel, 'value' | 'value_m3' | 'errorRate'> {
  if (typeof raw !== 'string') {
    throw new ParseError()
  }
  if (!raw.length) {
    throw new ParseError()
  }

  const parts = raw.split('|')
  const value = parseInt(parts[0])
  if (isNaN(value)) {
    throw new ParseError()
  }

  return {value, value_m3: parseNumber(parts[1]), errorRate: parseNumber(parts[2])}
}

export const postLevel: Route =
  ({services}) =>
  async (req, res) => {
    try {
      const {value, value_m3, errorRate} = parseValue(req.query.value)
      const mode = req.query.mode === 'auto' ? LevelMode.Auto : LevelMode.Manual
      await services.levels.insertOne({value, value_m3, errorRate, mode})
      res.send({ok: true})
    } catch (e) {
      if (e instanceof ParseError) {
        res.sendStatus(400)
        return
      }
      throw e
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
      severity: Severity.Info,
    })
    res.send({ok: true})
  }
