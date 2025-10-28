import {Document, ObjectId, Sort} from 'mongodb'
import {exec} from '../db'
import {Level, NewLevel, Severity} from '../models'
import {Config} from '../config'
import {EmailsService} from './emails'
import {LogsService} from './logs'
import {Service} from './base'

interface Dependencies {
  emails: EmailsService
  logs: LogsService
}

const MAX_HISTORY_DEPTH = 62

export class LevelsService extends Service<Dependencies, Config['levels']> {
  private cache: Record<string, {key: ObjectId | null; data: Level[] | null}> = {}

  public async insertOne(doc: Omit<NewLevel, 'when'>): Promise<void> {
    const [previousLevel] = await this.toArray({limit: 1, sort: {when: -1}})

    const when = new Date()
    await exec<NewLevel>('levels', async (collection) => {
      await collection.insertOne({...doc, when})
    })

    if (doc.value >= this.config.warningAt) {
      this.dependencies.emails.sendLevelNotification(doc.value)
    }

    const valueDiff = doc.value - previousLevel.value
    if (valueDiff > 1) {
      const hoursDiff = Math.floor((when.valueOf() - previousLevel.when.valueOf()) / 1000 / 60 / 60) || 1
      const speed = valueDiff / hoursDiff
      const warning = speed >= this.config.warningHighDiffPerHour
      this.dependencies.logs.insertOneFromWeb({
        message: `Level increase rate: ${valueDiff.toPrecision(2)}% ÷ ${hoursDiff}h = ${speed.toPrecision(2)}%/h (warning at: ≥${this.config.warningHighDiffPerHour}%/h)`,
        severity: warning ? Severity.Warning : Severity.Debug,
      })
      if (warning) {
        this.dependencies.emails.sendHighDiffNotification({
          hours: hoursDiff,
          value: doc.value,
          prevValue: previousLevel.value,
        })
      }
    }
  }

  public async deleteOne(id: string): Promise<void> {
    const level = (await this.toArray({filter: {_id: new ObjectId(id)}}))[0]
    if (!level) {
      console.warn(`Level with id=${id} does not exists`)
      return
    }
    this.cache = {}

    await exec<Level>('levels', async (collection) => {
      await collection.deleteOne({_id: new ObjectId(id)})
    })

    await this.dependencies.logs.insertOneFromWeb({
      message: `Removed level "${level.value}" (${level.when.toLocaleString('ru')})`,
      severity: Severity.Info,
    })
  }

  public async toArray({limit, filter, sort}: {limit?: number; filter?: Document; sort?: Sort} = {}): Promise<Level[]> {
    return exec<Level, Level[]>('levels', async (collection) => {
      let cursor = collection.find()
      if (sort) {
        cursor = cursor.sort(sort)
      }
      if (filter) {
        cursor = cursor.filter(filter)
      }
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }

  public async toThrottledArray({freq, limit}: {freq: number; limit: number}): Promise<Level[]> {
    if (freq < 0 || freq > 4) {
      return []
    }
    const today = new Date()
    const levels: Level[] = []
    let iteration = 0
    let depth = 0

    let cache = this.cache[freq]
    if (!cache) {
      cache = {key: null, data: null}
      this.cache[freq] = cache
    }

    const [last] = await this.toArray({
      sort: {when: -1},
      limit: 1,
    })

    if (last._id.equals(cache.key) && cache.data) {
      return cache.data
    }

    while (levels.length < limit && depth < MAX_HISTORY_DEPTH) {
      const dayPart = freq - 1 - (iteration % freq)
      const gte = new Date(today.valueOf())
      gte.setHours((24 / freq) * dayPart, 0, 0)
      const lt = new Date(today.valueOf())
      lt.setHours((24 / freq) * (dayPart + 1), 0, 0)
      const entries = await this.toArray({
        filter: {
          when: {
            $gte: gte,
            $lt: lt,
          },
        },
        sort: {when: -1},
      })
      if (entries.length) {
        levels.push(entries[0])
      }
      if (dayPart === 0) {
        today.setDate(today.getDate() - 1)
        depth++
      }
      iteration++
    }

    cache.key = last._id
    cache.data = levels
    return levels
  }
}
