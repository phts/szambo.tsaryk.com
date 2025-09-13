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
    await services.logs.insertOne({message, severity})
    res.send({ok: true})
  }
