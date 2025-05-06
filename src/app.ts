import 'dotenv/config'
import * as express from 'express'
import {root, level, log} from './routes'
import {getConfig} from './config'
import {init} from './db'
import {auth} from './middlewares/auth'

const config = getConfig()
init(config)

const app = express()
app.use(auth({config}))
app.get('/', root({config}))
app.post('/level', level({config}))
app.post('/log', log({config}))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.sendStatus(503)
})

app.listen(3000)
