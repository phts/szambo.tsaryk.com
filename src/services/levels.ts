import {Document, ObjectId} from 'mongodb'
import {exec} from '../db'
import {Level, NewLevel} from '../models'
import {Config} from '../config'
import {EmailsService} from './emails'
import {Service} from './base'

interface Dependencies {
  emails: EmailsService
}

export class LevelsService extends Service<Dependencies, Config['levels']> {
  public async insertOne(doc: Omit<NewLevel, 'when'>): Promise<void> {
    await exec<NewLevel>('levels', async (collection) => {
      await collection.insertOne({...doc, when: new Date()})
    })

    if (doc.value >= this.config.warningAt) {
      this.dependencies.emails.sendLevelNotification(doc.value)
    }
  }

  public async deleteOne(id: string): Promise<void> {
    await exec<Level>('levels', async (collection) => {
      await collection.deleteOne({_id: new ObjectId(id)})
    })
  }

  public async toArray({limit, filter}: {limit?: number; filter?: Document}): Promise<Level[]> {
    return exec<Level, Level[]>('levels', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (filter) {
        cursor = cursor.filter(filter)
      }
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }
}
