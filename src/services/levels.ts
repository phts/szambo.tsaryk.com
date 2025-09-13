import {Document, ObjectId} from 'mongodb'
import {exec, Level, NewLevel} from '../db'

export class LevelsService {
  public async insertOne(doc: NewLevel): Promise<void> {
    await exec<NewLevel>('levels', async (collection) => {
      await collection.insertOne(doc)
    })
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
