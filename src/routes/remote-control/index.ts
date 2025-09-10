import {Route} from '..'
import {exec, Log, RemoteControl, RemoteControlAction} from '../../db'
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

async function getRemoteControlItem(): Promise<RemoteControl | null> {
  let it: RemoteControl | null = null
  await exec<RemoteControl>('remote-control', async (collection) => {
    const cursor = collection.find().sort({_id: -1}).limit(1)
    it = (await cursor.toArray())[0] ?? null
  })
  return it
}

export const remoteControl: Route = () => async (req, res) => {
  const data: Data = {item: null, auth_wr: String(req.query.auth_wr)}
  data.item = await getRemoteControlItem()
  res.send(page(data))
}

export const remoteControlItem: Route = () => async (req, res) => {
  const item = await getRemoteControlItem()
  if (!item) {
    res.sendStatus(404)
    return
  }
  res.send(`${generateId(item)}|${item.action}`)
}

export const submitRemoteControl: Route =
  ({config}) =>
  async (req, res) => {
    const action: RemoteControlAction | undefined = req.body.action as RemoteControlAction
    if (!Object.values(RemoteControlAction).includes(action)) {
      res.sendStatus(400)
      return
    }

    const item = {when: new Date(), action}
    await exec<RemoteControl>('remote-control', async (collection) => {
      await collection.insertOne(item)
    })
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        message: `Remote action requested: ${action} (id=${generateId(item)})`,
        severity: 'info',
        when: new Date(),
      })
    })
    res.redirect(`/?auth=${config.auth.rd}&auth_wr=${config.auth.wr}`)
  }
