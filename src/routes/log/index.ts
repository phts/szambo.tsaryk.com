import {Route} from '..'

export const log: Route =
  ({services}) =>
  async (req, res) => {
    const {message, severity} = req.query
    if (
      typeof message !== 'string' ||
      typeof severity !== 'string' ||
      !['debug', 'info', 'warn', 'error', 'fatal'].includes(severity)
    ) {
      res.sendStatus(400)
      return
    }
    await services.logs.insertOneFromDevice({message, severity})
    if (severity === 'fatal') {
      services.emails.sendFatalNotification(message)
    }
    res.send({ok: true})
  }
