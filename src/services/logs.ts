import {exec} from '../db'
import {Log} from '../models'

export class LogsService {
  public async insertOne({message, severity}: {message: string; severity: string}): Promise<void> {
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        message,
        severity,
        when: new Date(),
      })
    })
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
}
