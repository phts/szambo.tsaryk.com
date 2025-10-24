import {Document, ObjectId, Sort} from 'mongodb'
import {exec} from '../db'
import {Level, LevelMode, NewLevel, Severity} from '../models'
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
  private cache: {key: ObjectId | null; data: Level[] | null} = {key: null, data: null}

  public async insertOne(doc: Omit<NewLevel, 'when'>): Promise<void> {
    const [previousLevel] = await this.toArray({limit: 1, sort: {when: -1}})

    const when = new Date()
    await exec<NewLevel>('levels', async (collection) => {
      await collection.insertOne({...doc, when})
    })

    if (doc.value >= this.config.warningAt) {
      this.dependencies.emails.sendLevelNotification(doc.value)
    }

    if (doc.value > previousLevel.value) {
      const valueDiff = doc.value - previousLevel.value
      const hoursDiff = Math.floor((when.valueOf() - previousLevel.when.valueOf()) / 1000 / 60 / 60) || 1
      const speed = valueDiff / hoursDiff
      this.dependencies.logs.insertOneFromWeb({
        message: `Level increase rate: ${valueDiff}% ÷ ${hoursDiff}h = ${speed}%/h (warning at: ${this.config.warningHighDiffPerHour}%/h)`,
        severity: Severity.Debug,
      })
      if (speed >= this.config.warningHighDiffPerHour) {
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
    this.cache.key = null

    await exec<Level>('levels', async (collection) => {
      await collection.deleteOne({_id: new ObjectId(id)})
    })

    await this.dependencies.logs.insertOneFromWeb({
      message: `Removed level "${level.value}" (${level.when.toLocaleString()})`,
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

  public async toThrottledArray({limit}: {limit: number}): Promise<Level[]> {
    const today = new Date()
    const levels: Level[] = []
    let iteration = 0

    while (levels.length < limit && iteration < MAX_HISTORY_DEPTH) {
      iteration++
      const gte = new Date(today.valueOf())
      gte.setHours(0, 0, 0)
      const lt = new Date(today.valueOf())
      lt.setHours(23, 59, 59)
      const entries = await this.toArray({
        filter: {
          mode: LevelMode.Auto,
          when: {
            $gte: gte,
            $lte: lt,
          },
        },
        sort: {when: -1},
      })
      if (entries.length) {
        if (iteration === 1) {
          if (entries[0]._id.equals(this.cache.key) && this.cache.data) {
            return this.cache.data
          }
          this.cache.key = entries[0]._id
        }
        levels.push(entries[0])
      }
      today.setDate(today.getDate() - 1)
    }

    this.cache.data = levels
    return levels
  }
}
