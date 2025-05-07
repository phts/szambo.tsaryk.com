import * as path from 'path'
import {readFileSync} from 'fs'
import {RemoteControl} from '../../db'

export interface Data {
  item: RemoteControl | null
}

const tmpl = readFileSync(path.resolve(__dirname, 'remote-control.tmpl.html')).toString()

export function page(data: Data) {
  const lastWhen = data.item ? data.item.when.toLocaleString() : 'never'
  const lastActions = data.item ? data.item.action : 'none'
  return tmpl.replace('{{lastWhen}}', lastWhen).replace('{{lastActions}}', lastActions)
}
