import {Sort} from 'mongodb'
import {exec} from '../db'
import {RemoteControl} from '../models'
import {Service} from './base'

export class RemoteControlService extends Service<null, null> {
  public async insertOne(doc: RemoteControl): Promise<void> {
    await exec<RemoteControl>('remote-control', async (collection) => {
      await collection.insertOne(doc)
    })
  }

  public async toArray({limit, sort}: {limit?: number; sort?: Sort}): Promise<RemoteControl[]> {
    return exec<RemoteControl, RemoteControl[]>('remote-control', async (collection) => {
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
}
