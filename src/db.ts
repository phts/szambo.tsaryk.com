import {Collection, Document, MongoClient} from 'mongodb'
import {Config} from './config'

export interface Level {
  value: number
  when: Date
}

let uri: string

export function init(config: Config) {
  uri = config.db.uri
}

export async function exec<T extends Document>(
  name: string,
  operation: (collection: Collection<T>) => Promise<unknown>,
  {onError}: {onError: (e: unknown) => void}
) {
  const client = new MongoClient(uri)
  try {
    const db = client.db()
    const collection = db.collection<T>(name)
    await operation(collection)
  } catch (e) {
    console.error(e)
    if (onError) {
      onError(e)
    }
  } finally {
    await client.close()
  }
}
