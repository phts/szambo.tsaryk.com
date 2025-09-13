import {exec, Log} from '../db'

export class LogsService {
  public async insertOne(doc: {message: string; severity: string}): Promise<void> {
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        ...doc,
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
