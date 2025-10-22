import 'dotenv/config'
import * as path from 'node:path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {
  deleteLevel,
  deleteScheduledAction,
  getRc,
  getRemoteControl,
  getRoot,
  getScheduledActions,
  postLevel,
  postLog,
  postRemoteControl,
} from './routes'
import {getConfig} from './config'
import {init} from './db'
import {auth} from './middlewares/auth'
import {EmailsService, LevelsService, LogsService, RemoteControlService, ScheduledActionsService} from './services'

const config = getConfig()
init(config)

const emails = new EmailsService(config.emails)
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
app.get('/remote-control', getRemoteControl({config, services}))
app.get('/scheduled-actions', getScheduledActions({config, services}))
app.get('/rc', getRc({config, services}))
app.get('/', getRoot({config, services}))
app.post('/level', postLevel({config, services}))
app.post('/log', postLog({config, services}))
app.post('/remote-control', postRemoteControl({config, services}))
app.delete('/level', deleteLevel({config, services}))
app.delete('/scheduled-action', deleteScheduledAction({config, services}))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(503)
})

app.listen(3000)
scheduledActions.watch()
