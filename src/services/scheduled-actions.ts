import {Document, ObjectId} from 'mongodb'
import {exec} from '../db'
import {NewScheduledAction, ScheduledAction} from '../models'
import {generateId} from '../routes'
import {LogsService} from './logs'
import {RemoteControlService} from './remote-control'

interface Dependencies {
  logs: LogsService
  remoteControl: RemoteControlService
}

export class ScheduledActionsService {
  private watcher?: NodeJS.Timeout
  private dependencies: Dependencies

  constructor(dependencies: Dependencies) {
    this.dependencies = dependencies
  }

  public async insertOne(doc: NewScheduledAction): Promise<void> {
    await exec<NewScheduledAction>('scheduled-actions', async (collection) => {
      await collection.insertOne(doc)
    })
  }

  public async getEarliest(): Promise<ScheduledAction | null> {
    return (await this.toArray())[0] ?? null
  }

  public async deleteOne(id: ObjectId | string): Promise<void> {
    if (typeof id === 'string') {
      id = new ObjectId(id)
    }
    await exec<ScheduledAction>('scheduled-actions', async (collection) => {
      await collection.deleteOne({_id: id})
    })
  }

  public async toArray({filter}: {filter?: Document} = {}): Promise<ScheduledAction[]> {
    return exec<ScheduledAction, ScheduledAction[]>('scheduled-actions', async (collection) => {
      let cursor = collection.find().sort({when: 1})
      if (filter) {
        cursor = cursor.filter(filter)
      }
      return cursor.toArray()
    })
  }

  public watch() {
    if (this.watcher) {
      throw new Error('Already watching')
    }
    this.watcher = setInterval(() => {
      this.check()
    }, 60000)
  }

  private async check() {
    const item = await this.getEarliest()
    if (!item) {
      return
    }

    const now = new Date()
    if (now.valueOf() < item.when.valueOf()) {
      return
    }

    const rcItem = {when: new Date(), action: item.action}
    this.dependencies.remoteControl.insertOne(rcItem)
    this.dependencies.logs.insertOne({
      message: `Requested remote action "${rcItem.action}" (id=${generateId(rcItem)}) by schedule`,
      severity: 'info',
    })

    this.deleteOne(item._id)
  }
}
