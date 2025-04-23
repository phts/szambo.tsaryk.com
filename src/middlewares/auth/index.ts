import {Middleware} from '..'

export const auth: Middleware =
  ({config}) =>
  (req, res, next) => {
    if (req.query.auth !== config.auth) {
      res.sendStatus(400)
      return
    }
    next()
  }
