import {Route} from '..'
import {LevelMode, NewLevel} from '../../models'
import {levelsPage} from './levelsPage'
import {toViewModel} from './levelsTable'

class ParseError extends Error {}

function parseNumber(raw?: string) {
  const value = parseFloat(String(raw))
  if (isNaN(value)) {
    return null
  }
  return value
}

function parseValue(capacity: number, raw?: unknown): Pick<NewLevel, 'value' | 'errorRate'> {
  if (typeof raw !== 'string') {
    throw new ParseError()
  }
  if (!raw.length) {
    throw new ParseError()
  }

  const parts = raw.split('|')
  const value = Math.round(parseFloat(parts[0]) * 100) / 100
  if (isNaN(value)) {
    throw new ParseError()
  }

  return {
    value,
    errorRate: parseNumber(parts[1]),
  }
}

export const getLevels: Route =
  ({services, config}) =>
  async (req, res) => {
    const levels = await services.levels.toArray({
      limit: 1000,
      sort: {when: -1},
    })
    res.send(
      levelsPage({
        levels: toViewModel(levels, {capacity: config.levels.capacity, warningLevel: config.levels.warningAt}),
        showRemove: req.query.auth_wr === config.auth.wr,
        showMode: true,
        authWr: req.query.auth_wr?.toString(),
      })
    )
  }

export const postLevel: Route =
  ({services, config}) =>
  async (req, res) => {
    try {
      const {value, errorRate} = parseValue(config.levels.capacity, req.query.value)
      const mode = req.query.mode === 'auto' ? LevelMode.Auto : LevelMode.Manual
      await services.levels.insertOne({value, errorRate, mode})
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
    await services.levels.deleteOne(req.query.id)
    res.send({ok: true})
  }
