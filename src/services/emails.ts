import * as nodemailer from 'nodemailer'
import {Config} from '../config'

export class EmailsService {
  private config: Config['emails']
  private transporter: nodemailer.Transporter

  constructor(config: Config['emails']) {
    this.config = config
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

  public sendFatalNotification(message: string) {
    const mailOptions = {
      subject: this.config.fatal.subject,
      text: this.config.fatal.text.replace('{{message}}', message),
    }
    this.sendMail(mailOptions)
  }

  private sendMail(mailOptions: {subject: string; text: string}) {
    this.transporter.sendMail({...mailOptions, from: this.config.from, to: this.config.to}, (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.info('Email sent: ' + info.response)
      }
    })
  }
}
