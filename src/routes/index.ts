import {RequestHandler} from 'express'
import {Config} from '../config'
import {LevelsService, LogsService, RemoteControlService} from '../services'

export * from './root'
export * from './level'
export * from './log'
export * from './remote-control'

interface RouteParams {
  config: Config
  services: {
    levels: LevelsService
    logs: LogsService
    remoteControl: RemoteControlService
  }
}

export type Route = (params: RouteParams) => RequestHandler
