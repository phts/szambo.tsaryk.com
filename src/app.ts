import 'dotenv/config'
import * as path from 'node:path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {
  root,
  level,
  log,
  remoteControl as remoteControlRoute,
  submitRemoteControl,
  remoteControlItem,
  removeLevel,
  scheduledActions as scheduledActionsRoute,
  removeScheduledAction,
} from './routes'
import {getConfig} from './config'
import {init} from './db'
import {auth} from './middlewares/auth'
import {EmailsService, LevelsService, LogsService, RemoteControlService, ScheduledActionsService} from './services'

const config = getConfig()
init(config)

const emails = new EmailsService(config.email)
const levels = new LevelsService()
const logs = new LogsService()
const remoteControl = new RemoteControlService()
const scheduledActions = new ScheduledActionsService({logs, remoteControl})
const services = {
  emails,
  levels,
  logs,
  remoteControl,
  scheduledActions,
}

const app = express()
app.use(bodyParser.urlencoded())
app.use(auth({config}))
app.use('/', express.static(path.join(__dirname, 'static')))
app.get('/remote-control', remoteControlRoute({config, services}))
app.get('/scheduled-actions', scheduledActionsRoute({config, services}))
app.get('/rc', remoteControlItem({config, services}))
app.get('/', root({config, services}))
app.post('/level', level({config, services}))
app.post('/log', log({config, services}))
app.post('/remote-control', submitRemoteControl({config, services}))
app.delete('/level', removeLevel({config, services}))
app.delete('/scheduled-action', removeScheduledAction({config, services}))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(503)
})

app.listen(3000)
scheduledActions.watch()
