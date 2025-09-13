import {Route} from '..'
import {RemoteControl, RemoteControlAction} from '../../models'
import {RemoteControlService} from '../../services'
import {Data, page} from './page'

function generateId(item: RemoteControl) {
  const {when} = item
  return [
    when.getFullYear(),
    (when.getMonth() + 1).toString().padStart(2, '0'),
    when.getDay().toString().padStart(2, '0'),
    when.getHours().toString().padStart(2, '0'),
    when.getMinutes().toString().padStart(2, '0'),
    when.getSeconds().toString().padStart(2, '0'),
  ].join('')
}

async function getRemoteControlItem(remoteControl: RemoteControlService): Promise<RemoteControl | null> {
  return (await remoteControl.toArray({limit: 1}))[0] ?? null
}

export const remoteControl: Route =
  ({services}) =>
  async (req, res) => {
    const data: Data = {item: null, auth_wr: String(req.query.auth_wr)}
    data.item = await getRemoteControlItem(services.remoteControl)
    res.send(page(data))
  }

export const remoteControlItem: Route =
  ({services}) =>
  async (req, res) => {
    const item = await getRemoteControlItem(services.remoteControl)
    if (!item) {
      res.sendStatus(404)
      return
    }
    res.send(`${generateId(item)}|${item.action}`)
  }

export const submitRemoteControl: Route =
  ({config, services}) =>
  async (req, res) => {
    const action: RemoteControlAction | undefined = req.body.action as RemoteControlAction
    if (!Object.values(RemoteControlAction).includes(action)) {
      res.sendStatus(400)
      return
    }

    const item = {when: new Date(), action}
    await services.remoteControl.insertOne(item)
    await services.logs.insertOne({
      message: `Remote action requested: ${action} (id=${generateId(item)})`,
      severity: 'info',
    })
    res.redirect(`/?auth=${config.auth.rd}&auth_wr=${config.auth.wr}`)
  }
