import * as nodemailer from 'nodemailer'
import {Config} from '../../config'

interface Props {
  config: Config['email']
  level: number
}

export function email({config, level}: Props) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })

  const mailOptions = {
    from: config.from,
    to: config.to,
    subject: config.subject,
    text: config.text.replace('{{level}}', level.toString()),
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error)
    } else {
      console.info('Email sent: ' + info.response)
    }
  })
}
