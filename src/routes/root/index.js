const {MongoClient} = require('mongodb')
const {page} = require('./page')

const root = (config) => async (req, res) => {
  const uri = config.db.uri
  const client = new MongoClient(uri)
  try {
    const db = client.db()
    const collection = db.collection('levels')
    const cursor = collection.find()
    const levels = await cursor.toArray()
    res.send(page({levels}))
  } catch (e) {
    console.error(e)
    res.sendStatus(503)
  } finally {
    await client.close()
  }
}

module.exports = {root}
