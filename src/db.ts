import {Collection, Document, MongoClient, ObjectId} from 'mongodb'
import {Config} from './config'

export enum LevelMode {
  Auto = 'auto',
  Manual = 'manual',
}
export interface NewLevel {
  value: number
  mode: LevelMode
  when: Date
}
export interface Level extends NewLevel {
  _id: ObjectId
}
export interface Log {
  message: string
  severity: string
  when: Date
}

export enum RemoteControlAction {
  Measure = 'measure',
  MeasureAndResetTimer = 'measure+reset',
}
export interface RemoteControl {
  when: Date
  action: RemoteControlAction
}

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
