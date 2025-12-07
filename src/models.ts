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
export interface NewLevel {
  value: number
  errorRate: number | null
  samples: number[] | null
  mode: LevelMode
  when: Date
}
export interface Level extends NewLevel {
  _id: ObjectId
}
export interface Log {
  message: string
  severity: Severity
  source: Source
  when: Date
}

export enum RemoteControlAction {
  Measure = 'measure',
  MeasureAndResetTimer = 'measure+reset',
  MeasureInterval = 'interval',
}
export interface RemoteControl {
  when: Date
  action: RemoteControlAction
  payload?: string | null
}

export type NewScheduledAction = RemoteControl
export interface ScheduledAction extends NewScheduledAction {
  _id: ObjectId
}
