import * as path from 'path'
import {readFileSync} from 'fs'
import {Request} from 'express'
import {ScheduledAction} from '../../models'

export interface Data {
  items: ScheduledAction[]
  query: Request['query']
}

const tmpl = readFileSync(path.resolve(__dirname, 'scheduled-actions.tmpl.html')).toString()

export function page(data: Data) {
  const itemsHtml = data.items.length
    ? `<table border=1><tr><th>When</th><th>Action</th><th>Remove</th></tr>
  ${data.items.map((it) => `<tr><td>${it.when.toLocaleString()}</td><td>${it.action}</td><td><button onclick='removeScheduledAction(${JSON.stringify(it._id)}, ${JSON.stringify(data.query.auth_wr)})'>×</button></tr>`).join('')}
</table>`
    : 'None'
  return tmpl.replace('{{items}}', itemsHtml)
}
