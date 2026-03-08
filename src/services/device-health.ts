import {Service} from './base'
import {EmailsService} from './emails'

interface Dependencies {
  emails: EmailsService
}

export enum Health {
  OK,
  PartiallyOK,
  Unstable,
}

export class DeviceHealthService extends Service<Dependencies, {minSequentialFailures: number}> {
  private sequentialFailures: number = 0
  private health: Health = Health.OK

  public getHealth(): Health {
    if (this.health === Health.Unstable) {
      return this.health
    }
    return this.sequentialFailures ? Health.PartiallyOK : this.health
  }

  public registerFailure() {
    if (this.sequentialFailures === this.config.minSequentialFailures) {
      return
    }
    this.sequentialFailures++
    if (this.health !== Health.Unstable && this.sequentialFailures === this.config.minSequentialFailures) {
      this.health = Health.Unstable
      this.dependencies.emails.sendUnstableNotification()
    }
  }

  public registerOk() {
    if (this.sequentialFailures === 0) {
      return
    }
    this.sequentialFailures--
    if (this.health !== Health.OK && this.sequentialFailures === 0) {
      this.health = Health.OK
      this.dependencies.emails.sendUnstableResolvedNotification()
    }
  }
}
