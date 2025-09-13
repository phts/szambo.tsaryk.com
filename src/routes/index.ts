import {RequestHandler} from 'express'
import {Config} from '../config'
import {LogsService} from '../services'

export * from './root'
export * from './level'
export * from './log'
export * from './remote-control'

interface RouteParams {
  config: Config
  services: {
    logs: LogsService
  }
}

export type Route = (params: RouteParams) => RequestHandler
