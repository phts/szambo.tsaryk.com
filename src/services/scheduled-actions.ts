import {Document, ObjectId, Sort} from 'mongodb'
import {exec} from '../db'
import {NewScheduledAction, ScheduledAction, Severity} from '../models'
import {actionWithPayloadToString, generateRcId} from '../helpers'
import {LogsService} from './logs'
import {RemoteControlService} from './remote-control'
import {Service} from './base'

interface Dependencies {
  logs: LogsService
  remoteControl: RemoteControlService
}

export class ScheduledActionsService extends Service<Dependencies, null> {
  private watcher?: NodeJS.Timeout

  public async insertOne(doc: NewScheduledAction): Promise<void> {
    await exec<NewScheduledAction>('scheduled-actions', async (collection) => {
      await collection.insertOne(doc)
    })
  }

  public async getEarliest(): Promise<ScheduledAction | null> {
    return (await this.toArray({limit: 1, sort: {when: 1}}))[0] ?? null
  }

  public async deleteOne(id: ObjectId | string): Promise<void> {
    if (typeof id === 'string') {
      id = new ObjectId(id)
    }
    await exec<ScheduledAction>('scheduled-actions', async (collection) => {
      await collection.deleteOne({_id: id})
    })
  }

  public async toArray({limit, filter, sort}: {limit?: number; filter?: Document; sort?: Sort} = {}): Promise<
    ScheduledAction[]
  > {
    return exec<ScheduledAction, ScheduledAction[]>('scheduled-actions', async (collection) => {
      let cursor = collection.find()
      if (sort) {
        cursor = cursor.sort(sort)
      }
      if (filter) {
        cursor = cursor.filter(filter)
      }
      if (limit) {
        cursor = cursor.limit(limit)
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
    this.dependencies.logs.insertOneFromWeb({
      message: `Remote action requested by schedule: ${actionWithPayloadToString(action, payload)} (id=${generateRcId(item)})`,
      severity: Severity.Info,
    })

    this.deleteOne(scheduledItem._id)
  }
}
