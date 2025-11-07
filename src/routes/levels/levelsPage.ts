import * as path from 'path'
import {readFileSync} from 'fs'
import {levelsTable, LevelViewModel} from './levelsTable'

const tmpl = readFileSync(path.resolve(__dirname, 'levels.tmpl.html')).toString()

export interface LevelsPageData {
  levels: LevelViewModel[]
  showMode: boolean
  showRemove: boolean
  warningLevel: number
  authWr?: string
}

export function levelsPage(data: LevelsPageData) {
  return tmpl.replace('{{levels}}', levelsTable(data))
}
