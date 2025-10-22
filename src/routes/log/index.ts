import {Route} from '..'
import {Severity} from '../../models'

export const postLog: Route =
  ({services}) =>
  async (req, res) => {
    const {message, severity} = req.query
    if (
      typeof message !== 'string' ||
      typeof severity !== 'string' ||
      !Object.values(Severity).includes(severity as Severity)
    ) {
      res.sendStatus(400)
      return
    }
    await services.logs.insertOneFromDevice({message, severity: severity as Severity})
    res.send({ok: true})
  }
