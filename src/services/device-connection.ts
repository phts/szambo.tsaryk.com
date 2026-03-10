import {Severity, Source} from '../models'
import {Service} from './base'
import {LogsService} from './logs'
import {LevelsService} from './levels'
import {DeviceHealthService} from './device-health'

interface Dependencies {
  levels: LevelsService
  logs: LogsService
  deviceHealth: DeviceHealthService
}

export class DeviceConnectionService extends Service<Dependencies, {interval: number}> {
  private watcher?: NodeJS.Timeout
  private lastLogId?: string
  private lastLevelId?: string

  public watch() {
    if (this.watcher) {
      throw new Error('Already watching')
    }
    this.check(true)
    this.watcher = setInterval(
      () => {
        this.check()
      },
      this.config.interval * 60 * 60 * 1000
    )
  }

  private async check(initialize: boolean = false) {
    const [lastLog] = await this.dependencies.logs.toArray({
      limit: 1,
      sort: {when: -1},
      filter: {source: Source.Device},
    })
    const [lastLevel] = await this.dependencies.levels.toArray({limit: 1, sort: {when: -1}})
    if (
      ((lastLog && lastLog._id.equals(this.lastLogId)) || (!lastLog && !this.lastLogId)) &&
      ((lastLevel && lastLevel._id.equals(this.lastLevelId)) || (!lastLevel && !this.lastLevelId))
    ) {
      this.dependencies.logs.insertOneFromWeb({
        severity: Severity.Error,
        message: `No activity registered from the device during last ${this.config.interval} hours`,
      })
      this.dependencies.deviceHealth.registerFailure()
      return
    }
    this.lastLogId = lastLog ? lastLog._id.toString() : undefined
    this.lastLevelId = lastLevel ? lastLevel._id.toString() : undefined
    if (!initialize) {
      this.dependencies.deviceHealth.registerOk()

      this.dependencies.logs.insertOneFromWeb({
        severity: Severity.Debug,
        message: 'Device: Online',
      })
    }
  }
}
