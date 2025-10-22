import {exec} from '../db'
import {RemoteControl} from '../models'
import {Service} from './base'

export class RemoteControlService extends Service<null, null> {
  public async insertOne(doc: RemoteControl): Promise<void> {
    await exec<RemoteControl>('remote-control', async (collection) => {
      await collection.insertOne(doc)
    })
  }

  public async toArray({limit}: {limit?: number}): Promise<RemoteControl[]> {
    return exec<RemoteControl, RemoteControl[]>('remote-control', async (collection) => {
      let cursor = collection.find().sort({_id: -1})
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }
}
