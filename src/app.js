const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.send('Root')
})
app.post('/data', function (req, res) {
  res.send('POST /data')
})

app.listen(3000)
