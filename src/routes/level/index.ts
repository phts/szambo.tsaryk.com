import {MongoClient} from 'mongodb'
import {Route} from '..'
import {Level} from '../../db'

export const level: Route =
  ({config}) =>
  async (req, res) => {
    const uri = config.db.uri
    const client = new MongoClient(uri)
    try {
      const newValue = parseInt(req.query.value as string)
      if (isNaN(newValue)) {
        res.sendStatus(400)
        return
      }
      const db = client.db()
      const collection = db.collection<Level>('levels')
      await collection.insertOne({value: newValue, when: new Date()})
      res.send({ok: true})
    } catch (e) {
      console.error(e)
      res.sendStatus(503)
    } finally {
      await client.close()
    }
  }
