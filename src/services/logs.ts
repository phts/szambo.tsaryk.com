import {Sort} from 'mongodb'
import {exec} from '../db'
import {Log, Severity, Source} from '../models'
import {Service} from './base'
import {EmailsService} from './emails'

interface Dependencies {
  emails: EmailsService
}

class SamplesShim {
  // temporary until device send samples itself
  private samples?: number[]

  public update(message: string) {
    const samplesShimRegex = /Samples: ([0-9,.]+)/
    const samplesShimMatch = message.match(samplesShimRegex)
    if (samplesShimMatch && samplesShimMatch[1]) {
      this.samples = samplesShimMatch[1].split(',').map(parseFloat).filter(Boolean)
    }
  }

  public reset() {
    this.samples = undefined
  }

  public getSamples() {
    return this.samples
  }
}

export class LogsService extends Service<Dependencies, null> {
  public samplesShim = new SamplesShim()

  public async insertOneFromDevice(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Device})
    this.samplesShim.update(doc.message)
  }
  public async insertOneFromWeb(doc: {message: string; severity: Severity}): Promise<void> {
    await this.insertOne({...doc, source: Source.Web})
  }

  public async toArray({limit, sort}: {limit?: number; sort?: Sort} = {}): Promise<Log[]> {
    return exec<Log, Log[]>('logs', async (collection) => {
      let cursor = collection.find()
      if (sort) {
        cursor = cursor.sort(sort)
      }
      if (limit) {
        cursor = cursor.limit(limit)
      }
      return cursor.toArray()
    })
  }

  private async insertOne(doc: {message: string; severity: Severity; source: Source}): Promise<void> {
    await exec<Log>('logs', async (collection) => {
      await collection.insertOne({
        ...doc,
        when: new Date(),
      })
    })
    if (doc.severity === Severity.Fatal) {
      this.dependencies.emails.sendFatalNotification(doc.message)
    }
  }
}
