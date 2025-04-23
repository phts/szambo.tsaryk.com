import {RequestHandler} from 'express'
import {Config} from '../config'

export * from './auth'

interface MiddlewareParams {
  config: Config
}

export type Middleware = (params: MiddlewareParams) => RequestHandler
