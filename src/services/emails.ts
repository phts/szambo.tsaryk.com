import * as nodemailer from 'nodemailer'
import {Config} from '../config'

export class EmailsService {
  private config: Config['email']
  private transporter: nodemailer.Transporter

  constructor(config: Config['email']) {
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
      from: this.config.from,
      to: this.config.to,
      subject: this.config.subject,
      text: this.config.text.replace('{{level}}', level.toString()),
    }

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
      } else {
        console.info('Email sent: ' + info.response)
      }
    })
  }
}
