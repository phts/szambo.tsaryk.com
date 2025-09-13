import 'dotenv/config'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {root, level, log, remoteControl, submitRemoteControl, remoteControlItem, removeLevel} from './routes'
import {getConfig} from './config'
import {init} from './db'
import {auth} from './middlewares/auth'
import {LevelsService, LogsService, RemoteControlService} from './services'

const config = getConfig()
init(config)

const services = {
  levels: new LevelsService(),
  logs: new LogsService(),
  remoteControl: new RemoteControlService(),
}

const app = express()
app.use(bodyParser.urlencoded())
app.use(auth({config}))
app.get('/remote-control', remoteControl({config, services}))
app.get('/rc', remoteControlItem({config, services}))
app.get('/', root({config, services}))
app.post('/level', level({config, services}))
app.post('/log', log({config, services}))
app.post('/remote-control', submitRemoteControl({config, services}))
app.delete('/level', removeLevel({config, services}))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(503)
})

app.listen(3000)
