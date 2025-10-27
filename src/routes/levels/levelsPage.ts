import * as path from 'path'
import {readFileSync} from 'fs'
import {Level, LevelMode} from '../../models'

const tmpl = readFileSync(path.resolve(__dirname, 'levels.tmpl.html')).toString()

export interface LevelsPageData {
  levels: Level[]
  showMode: boolean
  isAdmin: boolean
  warningLevel: number
  authWr?: string
}

export function getLevelsTableHtml({
  levels,
  showMode,
  isAdmin,
  warningLevel,
  authWr,
}: {
  levels: Level[]
  showMode: boolean
  isAdmin: boolean
  warningLevel: number
  authWr?: string
}) {
  return `<table class="levels" border=1>
<tr><th>When</th><th>%</th><th>m&sup3;</th><th title="Error rate">⚠</th>${showMode ? '<th>Mode</th>' : ''}
${isAdmin ? '<th>Remove</th>' : ''}</tr>
  ${levels
    .map(({_id, value, value_m3: m3, errorRate, when, mode}) => {
      const props = value >= warningLevel ? ` class="warn"` : ''
      return `\
<tr${props}>
<td>${when.toLocaleString('ru')}</td>
<td>${value}</td>
<td>${m3?.toFixed(2) ?? ''}</td>
<td>${typeof errorRate === 'number' ? `${errorRate}%` : ''}</td>
${showMode ? `<td>${mode === LevelMode.Auto ? 'a' : 'm'}</td>` : ''}
${isAdmin ? `<td><button onclick='removeLevel(${JSON.stringify(_id)}, ${JSON.stringify(authWr)})'>×</button></td>` : ''}
</tr>`
    })
    .join('')}
</table>
<script>
  async function removeLevel(id, auth) {
    const res = await fetch(\`/level?id=\${id}&auth=\${auth}\`, {method: 'DELETE'})
    if (res.ok) {
      window.location.reload()
    }
  }
</script>`
}

export function levelsPage(data: LevelsPageData) {
  return tmpl.replace('{{levels}}', getLevelsTableHtml(data))
}
