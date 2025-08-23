import 'dotenv/config'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import {root, level, log, remoteControl, submitRemoteControl, remoteControlItem, removeLevel} from './routes'
import {getConfig} from './config'
import {init} from './db'
import {auth} from './middlewares/auth'

const config = getConfig()
init(config)

const app = express()
app.use(bodyParser.urlencoded())
app.use(auth({config}))
app.get('/remote-control', remoteControl({config}))
app.get('/rc', remoteControlItem({config}))
app.get('/', root({config}))
app.post('/level', level({config}))
app.post('/log', log({config}))
app.post('/remote-control', submitRemoteControl({config}))
app.delete('/level', removeLevel({config}))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(503)
})

app.listen(3000)
