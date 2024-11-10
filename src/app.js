require('dotenv').config()
const express = require('express')
const {root} = require('./routes')

const app = express()

app.get('/', root({db: {uri: process.env.DB_URI}}))
app.post('/data', function (req, res) {
  res.send('POST /data')
})

app.listen(3000)
