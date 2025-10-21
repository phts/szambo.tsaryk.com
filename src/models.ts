import {ObjectId} from 'mongodb'

export enum LevelMode {
  Auto = 'auto',
  Manual = 'manual',
}
export enum Source {
  Device = 'device',
  Web = 'web',
}
export interface NewLevel {
  value: number
  value_m3: number | null
  mode: LevelMode
  when: Date
}
export interface Level extends NewLevel {
  _id: ObjectId
}
export interface Log {
  message: string
  severity: string
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
