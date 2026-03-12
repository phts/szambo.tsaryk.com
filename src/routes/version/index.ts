import {Route} from '..'

export const getVersion: Route =
  ({config: {version}}) =>
  async (req, res) => {
    res.send(`<!doctype html>
<html>
<body>${version}</body>
</html>
`)
  }
