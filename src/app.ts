import 'dotenv/config'
import * as express from 'express'
import {root} from './routes'
import {getConfig} from './config'

const config = getConfig()
const app = express()

app.get('/', root({config}))
app.post('/data', function (req, res) {
  res.send('POST /data')
})

app.listen(3000)
