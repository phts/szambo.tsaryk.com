import {Middleware} from '..'

const IGNORE_GET_PATH = ['/', '/favicon.png', '/favicon.ico', '/style.css', '/version']

export const auth: Middleware =
  ({config}) =>
  (req, res, next) => {
    if (req.method === 'GET' && IGNORE_GET_PATH.includes(req.path) && !req.query.auth) {
      next()
      return
    }
    if (
      (req.method === 'GET' && req.query.auth !== config.auth.rd) ||
      (['POST', 'PUT'].includes(req.method) &&
        req.query.auth !== config.auth.wr &&
        (req.body || {}).auth !== config.auth.wr) ||
      (req.method === 'DELETE' && req.query.auth !== config.auth.wr)
    ) {
      res.sendStatus(401)
      return
    }
    next()
  }
