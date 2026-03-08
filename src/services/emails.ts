import * as nodemailer from 'nodemailer'
import {Config} from '../config'
import {Severity} from '../models'
import {Service} from './base'
import {LogsService} from './logs'

interface Dependencies {
  logs: LogsService | null
}

export class EmailsService extends Service<Dependencies, Config['emails']> {
  private transporter: nodemailer.Transporter

  constructor(dependencies: Dependencies, config: Config['emails']) {
    super(dependencies, config)
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    })
  }

  public sendLevelNotification(level: number) {
    const mailOptions = {
      subject: this.config.level.subject,
      text: this.config.level.text.replace('{{level}}', level.toString()),
    }
    this.sendMail(mailOptions)
  }

  public sendHighDiffNotification({hours, value, prevValue}: {hours: number; value: number; prevValue: number}) {
    const mailOptions = {
      subject: this.config.highDiff.subject,
      text: this.config.highDiff.text
        .replace('{{hours}}', hours.toString())
        .replace('{{value}}', value.toString())
        .replace('{{prevValue}}', prevValue.toString()),
    }
    this.sendMail(mailOptions)
  }

  public sendUnstableNotification() {
    const mailOptions = {
      subject: this.config.unstable.subject,
      text: this.config.unstable.text,
    }
    this.sendMail(mailOptions)
  }
  public sendUnstableResolvedNotification() {
    const mailOptions = {
      subject: this.config.unstableResolved.subject,
      text: this.config.unstableResolved.text,
    }
    this.sendMail(mailOptions)
  }

  private sendMail(mailOptions: {subject: string; text: string}) {
    this.transporter.sendMail({...mailOptions, from: this.config.from, to: this.config.to}, (error) => {
      if (error) {
        console.error(error)
        this.dependencies.logs?.insertOneFromWeb({
          message: `Email failed: <code>${error}</code>`,
          severity: Severity.Error,
        })
      } else {
        this.dependencies.logs?.insertOneFromWeb({
          message: `Email sent: <code>${mailOptions.text}</code>`,
          severity: Severity.Info,
        })
      }
    })
  }
}
