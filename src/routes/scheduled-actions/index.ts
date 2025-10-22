import {ObjectId} from 'mongodb'
import {Route} from '..'
import {actionWithPayloadToString} from '../../helpers'
import {Severity} from '../../models'
import {Data, page} from './page'

export const getScheduledActions: Route =
  ({services}) =>
  async (req, res) => {
    const data: Data = {
      items: await services.scheduledActions.toArray(),
      query: req.query,
    }
    res.send(page(data))
  }

export const deleteScheduledAction: Route =
  ({services}) =>
  async (req, res) => {
    if (typeof req.query.id !== 'string') {
      res.sendStatus(400)
      return
    }

    const item = (await services.scheduledActions.toArray({filter: {_id: new ObjectId(req.query.id)}}))[0]
    if (!item) {
      console.warn(`Scheduled action with id=${req.query.id} does not exists`)
      res.send({ok: true})
      return
    }

    await services.logs.insertOneFromWeb({
      message: `Removed scheduled action ${actionWithPayloadToString(item.action, item.payload)} (${item.when.toLocaleString()})`,
      severity: Severity.Info,
    })

    await services.scheduledActions.deleteOne(req.query.id)
    res.send({ok: true})
  }
