import {exec} from '../db'
import {Log, Source} from '../models'

export class LogsService {
  public async insertOneFromDevice(doc: {message: string; severity: string}): Promise<void> {
    await this.insertOne({...doc, source: Source.Device})
  }
  public async insertOneFromWeb(doc: {message: string; severity: string}): Promise<void> {
    await this.insertOne({...doc, source: Source.Web})
  }

  public async toArray({limit}: {limit?: number}): Promise<Log[]> {
    return exec<Log, Log[]>('logs', async (collection) => {
      let cursor = collection.find().sort({when: -1})
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }

  private async insertOne(doc: {message: string; severity: string; source: Source}): Promise<void> {
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        ...doc,
        when: new Date(),
      })
    })
  }
}
