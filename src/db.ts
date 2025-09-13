import {Collection, Document, MongoClient} from 'mongodb'
import {Config} from './config'

let uri: string

export function init(config: Config) {
  uri = config.db.uri
}

export async function exec<T extends Document, R = unknown>(
  name: string,
  operation: (collection: Collection<T>) => Promise<R>
): Promise<R> {
  let res: R
  const client = new MongoClient(uri)
  try {
    const db = client.db()
    const collection = db.collection<T>(name)
    res = await operation(collection)
  } finally {
    await client.close()
  }
  return res
}
