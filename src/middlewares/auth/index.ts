import {Middleware} from '..'

export const auth: Middleware =
  ({config}) =>
  (req, res, next) => {
    if (req.method === 'GET' && req.path === '/' && !req.query.auth) {
      next()
      return
    }
    if (
      (req.method === 'GET' && req.query.auth !== config.auth.rd) ||
      (req.method !== 'GET' && req.query.auth !== config.auth.wr && req.body.auth !== config.auth.wr)
    ) {
      res.sendStatus(401)
      return
    }
    next()
  }
