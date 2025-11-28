import {Route} from '..'

export const getVersion: Route =
  ({config: {version}}) =>
  async (req, res) => {
    res.send(version)
  }
