import 'dotenv/config'
import * as express from 'express'
import {root, level} from './routes'
import {getConfig} from './config'

const config = getConfig()

const app = express()
app.get('/', root({config}))
app.post('/level', level({config}))

app.listen(3000)
