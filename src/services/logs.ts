import {Sort, Document} from 'mongodb'
import {exec} from '../db'
import {Log, New, Severity, Source} from '../models'
import {Service} from './base'
import {DeviceHealthService} from './device-health'
import {EmailsService} from './emails'

interface Dependencies {
  emails: EmailsService
  deviceHealth: DeviceHealthService
}

export class LogsService extends Service<Dependencies, null> {
  public async insertOneFromDevice(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Device})
  }
  public async insertOneFromWeb(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Web})
  }

  public async toArray({limit, filter, sort}: {limit?: number; filter?: Document; sort?: Sort} = {}): Promise<Log[]> {
    return exec<Log, Log[]>('logs', async (collection) => {
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

  private async insertOne(doc: {message: string; severity: Severity; source: Source}): Promise<void> {
    await exec<New<Log>>('logs', async (collection) => {
      await collection.insertOne({
        ...doc,
        when: new Date(),
      })
    })
    if (doc.severity === Severity.Fatal) {
      this.dependencies.deviceHealth.registerFailure()
    }
  }
}
