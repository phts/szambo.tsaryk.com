import {RequestHandler} from 'express'
import {Config} from '../config'
import {EmailsService, LevelsService, LogsService, RemoteControlService, ScheduledActionsService} from '../services'

export * from './root'
export * from './levels'
export * from './logs'
export * from './remote-control'
export * from './scheduled-actions'

interface RouteParams {
  config: Config
  services: {
    emails: EmailsService
    levels: LevelsService
    logs: LogsService
    remoteControl: RemoteControlService
    scheduledActions: ScheduledActionsService
  }
}

export type Route = (params: RouteParams) => RequestHandler
