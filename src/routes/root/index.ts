import {MongoClient} from 'mongodb'
import {Route} from '../index'
import {Level} from '../../db'
import {page} from './page'

export const root: Route =
  ({config}) =>
  async (req, res) => {
    const uri = config.db.uri
    const client = new MongoClient(uri)
    try {
      const db = client.db()
      const collection = db.collection<Level>('levels')
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
