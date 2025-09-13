import {ObjectId} from 'mongodb'

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

export interface NewScheduledAction {
  when: Date
  action: RemoteControlAction
}
export interface ScheduledAction extends NewScheduledAction {
  _id: ObjectId
}
