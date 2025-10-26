import {Route} from '..'
import {LevelMode, NewLevel} from '../../models'
import {levelsPage} from './levelsPage'

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

export const getLevels: Route =
  ({services, config}) =>
  async (req, res) => {
    const levels = await services.levels.toArray({
      limit: 1000,
      sort: {when: -1},
    })
    res.send(
      levelsPage({
        levels,
        isAdmin: req.query.auth_wr === config.auth.wr,
        showMode: true,
        warningLevel: config.levels.warningAt,
        authWr: req.query.auth_wr?.toString(),
      })
    )
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
    await services.levels.deleteOne(req.query.id)
    res.send({ok: true})
  }
