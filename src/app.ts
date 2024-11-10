import 'dotenv/config'
import * as express from 'express'
import {root, level} from './routes'
import {getConfig} from './config'
import {init} from './db'

const config = getConfig()
init(config)

const app = express()
app.get('/', root({config}))
app.post('/level', level({config}))

app.listen(3000)
