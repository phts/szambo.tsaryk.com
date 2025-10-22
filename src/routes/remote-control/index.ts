import {Route} from '..'
import {RemoteControl, RemoteControlAction, Severity} from '../../models'
import {RemoteControlService} from '../../services'
import {tzOffsetToIsoTimezone} from '../../utils'
import {actionWithPayloadToString, generateRcId} from '../../helpers'
import {Data, page} from './page'

async function getRemoteControlItem(remoteControl: RemoteControlService): Promise<RemoteControl | null> {
  return (await remoteControl.toArray({limit: 1}))[0] ?? null
}

export const getRemoteControl: Route =
  ({services}) =>
  async (req, res) => {
    const data: Data = {item: null, auth_wr: String(req.query.auth_wr)}
    data.item = await getRemoteControlItem(services.remoteControl)
    res.send(page(data))
  }

export const getRc: Route =
  ({services}) =>
  async (req, res) => {
    const item = await getRemoteControlItem(services.remoteControl)
    if (!item) {
      res.sendStatus(404)
      return
    }
    res.send(`${generateRcId(item)}|${item.action}${item.payload ? `=${item.payload}` : ''}`)
  }

export const postRemoteControl: Route =
  ({config, services}) =>
  async (req, res) => {
    const {action, when, scheduledDatetime, scheduledTimezone, interval} = req.body
    if (!Object.values(RemoteControlAction).includes(action)) {
      res.sendStatus(400)
      return
    }
    if (!['now', 'scheduled'].includes(when)) {
      res.sendStatus(400)
      return
    }

    let payload
    if (action === 'interval') {
      payload = interval
    }

    const item: RemoteControl = {action, when: new Date(), ...(payload ? {payload} : null)}

    if (when === 'now') {
      await services.remoteControl.insertOne(item)
      await services.logs.insertOneFromWeb({
        message: `Requested remote action ${actionWithPayloadToString(action, payload)} (id=${generateRcId(item)})`,
        severity: Severity.Info,
      })
    } else if (when === 'scheduled') {
      const datetime = new Date(`${scheduledDatetime}:00${tzOffsetToIsoTimezone(parseInt(scheduledTimezone))}`)
      if (isNaN(datetime.valueOf())) {
        res.sendStatus(400)
        return
      }
      item.when = datetime
      services.scheduledActions.insertOne(item)
      await services.logs.insertOneFromWeb({
        message: `Scheduled remote action ${actionWithPayloadToString(action, payload)} on ${datetime.toLocaleString()}`,
        severity: Severity.Info,
      })
    }

    res.redirect(`/?auth=${config.auth.rd}&auth_wr=${config.auth.wr}`)
  }
