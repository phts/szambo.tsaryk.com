import {RequestHandler} from 'express'
import {Config} from '../config'
import {
  EmailsService,
  LevelsService,
  LogsService,
  RemoteControlService,
  ScheduledActionsService,
  DeviceHealthService,
} from '../services'

export * from './root'
export * from './levels'
export * from './logs'
export * from './remote-control'
export * from './scheduled-actions'
export * from './version'

interface RouteParams {
  config: Config
  services: {
    emails: EmailsService
    levels: LevelsService
    logs: LogsService
    remoteControl: RemoteControlService
    scheduledActions: ScheduledActionsService
    deviceHealth: DeviceHealthService
  }
}

export type Route = (params: RouteParams) => RequestHandler
