import {RequestHandler} from 'express'
import {Config} from '../config'

export * from './root'
export * from './level'

interface RouteParams {
  config: Config
}

export type Route = (params: RouteParams) => RequestHandler
