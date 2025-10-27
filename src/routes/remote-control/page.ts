import * as path from 'path'
import {readFileSync} from 'fs'
import {RemoteControl} from '../../models'

export interface Data {
  item: RemoteControl | null
  auth_wr?: string
}

const tmpl = readFileSync(path.resolve(__dirname, 'remote-control.tmpl.html')).toString()

export function page(data: Data) {
  const lastWhen = data.item ? data.item.when.toLocaleString('ru') : 'never'
  const lastActions = data.item ? data.item.action : 'none'
  return tmpl
    .replace('{{lastWhen}}', lastWhen)
    .replace('{{lastActions}}', lastActions)
    .replace('{{auth_wr}}', data.auth_wr || '')
}
