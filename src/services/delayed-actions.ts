import {exec} from '../db'
import {ScheduledAction, Log, RemoteControl} from '../models'
import {generateId} from '../routes'

export class ScheduledActionsService {
  private watcher?: NodeJS.Timeout

  public watch() {
    if (this.watcher) {
      throw new Error('Already watching')
    }
    this.watcher = setInterval(() => {
      this.check()
    }, 60000)
  }

  private async check() {
    await exec<ScheduledAction>('scheduled-actions', async (collection) => {
      const cursor = collection.find().sort({when: 1}).limit(1)
      const item = (await cursor.toArray())[0] ?? null
      if (!item) {
        return
      }
      const now = new Date()
      if (now.valueOf() < item.when.valueOf()) {
        return
      }

      collection.deleteOne({_id: item._id})

      const rcItem = {when: new Date(), action: item.action}
      await exec<RemoteControl>('remote-control', async (collection) => {
        await collection.insertOne(rcItem)
      })
      await exec<Log>('logs', async (collection) => {
        await collection.insertOne({
          message: `Scheduled remote action requested: ${rcItem.action} (id=${generateId(rcItem)})`,
          severity: 'info',
          when: new Date(),
        })
      })
    })
  }
}
