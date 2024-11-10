import {RequestHandler} from 'express'
import {Config} from '../config'

export * from './root'

interface RouteParams {
  config: Config
}

export type Route = (params: RouteParams) => RequestHandler
