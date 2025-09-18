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
    ? `<table border=1><tr><th>When</th><th>Action</th><th>Payload</th><th>Remove</th></tr>
  ${data.items
    .map((it) => [
      it.when.toLocaleString(),
      it.action,
      it.payload ?? '',
      `<button onclick='removeScheduledAction(${JSON.stringify(it._id)}, ${JSON.stringify(data.query.auth_wr)})'>×</button>`,
    ])
    .map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}
</table>`
    : 'None'
  return tmpl.replace('{{items}}', itemsHtml)
}
