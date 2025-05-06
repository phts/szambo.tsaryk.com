import {Route} from '..'
import {exec, RemoteControl, RemoteControlAction} from '../../db'
import {Data, page} from './page'

async function getRemoteControlItem(): Promise<RemoteControl | null> {
  let it: RemoteControl | null = null
  await exec<RemoteControl>('remote-control', async (collection) => {
    const cursor = collection.find().sort({_id: -1}).limit(1)
    it = (await cursor.toArray())[0] ?? null
  })
  return it
}

export const remoteControl: Route = () => async (req, res) => {
  const data: Data = {item: null}
  data.item = await getRemoteControlItem()
  res.send(page(data))
}

export const remoteControlItem: Route = () => async (req, res) => {
  const item = await getRemoteControlItem()
  if (!item) {
    res.sendStatus(404)
    return
  }
  res.send(`id=${item.when.toISOString()};actions=${item.actions.join(',')}`)
}

export const submitRemoteControl: Route =
  ({config}) =>
  async (req, res) => {
    const actions: RemoteControlAction[] = []
    if (req.body.check === 'on') {
      actions.push(RemoteControlAction.Check)
    }
    if (!actions.length) {
      res.sendStatus(400)
      return
    }

    await exec<RemoteControl>('remote-control', async (collection) => {
      const item = {when: new Date(), actions}
      await collection.insertOne(item)
      res.redirect(`/?auth=${config.auth.rd}`)
    })
  }
