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

app.listen(3000)
