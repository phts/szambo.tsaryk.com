import {Sort} from 'mongodb'
import {exec} from '../db'
import {Log, Severity, Source} from '../models'
import {Service} from './base'
import {EmailsService} from './emails'

interface Dependencies {
  emails: EmailsService
}

export class LogsService extends Service<Dependencies, null> {
  public async insertOneFromDevice(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Device})
  }
  public async insertOneFromWeb(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Web})
  }

  public async toArray({limit, sort}: {limit?: number; sort?: Sort} = {}): Promise<Log[]> {
    return exec<Log, Log[]>('logs', async (collection) => {
      let cursor = collection.find()
      if (sort) {
        cursor = cursor.sort(sort)
      }
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }

  private async insertOne(doc: {message: string; severity: Severity; source: Source}): Promise<void> {
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        ...doc,
        when: new Date(),
      })
    })
    if (doc.severity === Severity.Fatal) {
      this.dependencies.emails.sendFatalNotification(doc.message)
    }
  }
}
