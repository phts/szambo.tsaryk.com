import {Document, ObjectId} from 'mongodb'
import {exec} from '../db'
import {NewScheduledAction, ScheduledAction} from '../models'
import {actionWithPayloadToString, generateRcId} from '../helpers'
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
    const scheduledItem = await this.getEarliest()
    if (!scheduledItem) {
      return
    }

    const now = new Date()
    if (now.valueOf() < scheduledItem.when.valueOf()) {
      return
    }

    const {action, payload} = scheduledItem
    const item = {when: new Date(), action, payload}
    this.dependencies.remoteControl.insertOne(item)
    this.dependencies.logs.insertOne({
      message: `Requested remote action  ${actionWithPayloadToString(action, payload)} (id=${generateRcId(item)}) by schedule`,
      severity: 'info',
    })

    this.deleteOne(scheduledItem._id)
  }
}
