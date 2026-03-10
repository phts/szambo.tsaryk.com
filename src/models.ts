import {ObjectId} from 'mongodb'

export enum LevelMode {
  Auto = 'auto',
  Manual = 'manual',
}
export enum Source {
  Device = 'device',
  Web = 'web',
}
export enum Severity {
  Debug = 'debug',
  Info = 'info',
  Warning = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

interface MongodbDocument {
  _id: ObjectId
}

export interface Level extends MongodbDocument {
  value: number
  errorRate: number | null
  samples: number[] | null
  mode: LevelMode
  when: Date
  hidden?: boolean | null
}

export interface Log extends MongodbDocument {
  message: string
  severity: Severity
  source: Source
  when: Date
}

export enum RemoteControlAction {
  Measure = 'measure',
  MeasureAndResetTimer = 'measure+reset',
  MeasureInterval = 'interval',
  LedOff = 'led-off',
}

export interface RemoteControl extends MongodbDocument {
  _id: ObjectId
  when: Date
  action: RemoteControlAction
  payload?: string | null
}

export type ScheduledAction = RemoteControl

export type New<T> = Omit<T, '_id'>
