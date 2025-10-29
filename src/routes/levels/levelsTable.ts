import {ObjectId} from 'mongodb'
import {Level, LevelMode} from '../../models'
import {percentageToCubeMeters} from '../../helpers'

export interface LevelViewModel {
  _id: ObjectId
  value: number
  m3: string
  errorRate: number | null
  mode: LevelMode
  when: Date
}

export interface LevelsTableData {
  levels: LevelViewModel[]
  showMode: boolean
  isAdmin: boolean
  warningLevel: number
  authWr?: string
}

export function toViewModel(levels: Level[], {capacity}: {capacity: number}): LevelViewModel[] {
  return levels.map((x) => ({
    ...x,
    value: Math.round(x.value),
    m3: percentageToCubeMeters(capacity, x.value).toFixed(2),
  }))
}

export function levelsTable({levels, showMode, isAdmin, warningLevel, authWr}: LevelsTableData) {
  return `<table class="levels" border=1>
<tr><th>When</th><th>%</th><th>m&sup3;</th><th title="Error rate">⚠</th>${showMode ? '<th>Mode</th>' : ''}
${isAdmin ? '<th>Remove</th>' : ''}</tr>
  ${levels
    .map(({_id, value, m3, errorRate, when, mode}) => {
      const props = value >= warningLevel ? ` class="warn"` : ''
      return `\
<tr${props}>
<td>${when.toLocaleString('ru')}</td>
<td>${value}</td>
<td>${m3}</td>
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
