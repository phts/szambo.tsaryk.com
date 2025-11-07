import {ObjectId} from 'mongodb'
import {Level, LevelMode} from '../../models'
import {percentageToCubeMeters} from '../../helpers'

export interface LevelViewModel {
  _id: ObjectId
  delta_m3: string
  errorRate: number | null
  m3_str: string
  m3: number
  mode: LevelMode
  value: number
  warning: boolean
  when: Date
}

export interface LevelsTableData {
  levels: LevelViewModel[]
  showMode: boolean
  showRemove: boolean
  showDelta: boolean
  authWr?: string
}

const MODE_TO_ELEMENT = {
  [LevelMode.Auto]: '<span title="Auto">⏰</span>',
  [LevelMode.Manual]: '<span title="Manual">🚀</span>',
}

export function toViewModel(
  levels: Level[],
  {capacity, warningLevel}: {capacity: number; warningLevel: number}
): LevelViewModel[] {
  return levels.reduce((acc, x) => {
    const m3 = percentageToCubeMeters(capacity, x.value)
    if (acc.length) {
      const nextEntry = acc[acc.length - 1]
      const delta = nextEntry.m3 - m3
      nextEntry.delta_m3 = delta > -0.1 && delta <= 0.01 ? '' : delta.toFixed(2)
    }
    acc.push({
      ...x,
      value: Math.round(x.value),
      warning: x.value >= warningLevel,
      m3,
      m3_str: m3.toFixed(2),
      delta_m3: '',
    })
    return acc
  }, [] as LevelViewModel[])
}

const errorRateClass = (errorRate: number | null): string => {
  if (typeof errorRate !== 'number') {
    return ''
  }
  if (errorRate > 50) {
    return ' class="highErrorRate"'
  } else if (errorRate > 15) {
    return ' class="mediumErrorRate"'
  }
  return ' class="lowErrorRate"'
}

export function levelsTable({levels, showMode, showDelta, showRemove, authWr}: LevelsTableData) {
  return `<table class="levels" border=1>
<tr><th>When</th><th>%</th><th>m&sup3;</th>${showDelta ? `<th title="Delta">Δm&sup3;</th>` : ''}<th title="Error rate">⚠%</th>${showMode ? '<th>Mode</th>' : ''}
${showRemove ? '<th>Remove</th>' : ''}</tr>
  ${levels
    .map(({_id, value, m3_str: m3, delta_m3: delta, errorRate, when, mode, warning}) => {
      const props = warning ? ` class="warn"` : ''
      return `\
<tr${props}>
<td>${when.toLocaleString('ru')}</td>
<td>${value}</td>
<td>${m3}</td>
${showDelta ? `<td${delta.startsWith('-') ? ' class="negativeDelta"' : ''}>${delta}</td>` : ''}
<td${errorRateClass(errorRate)}>${typeof errorRate === 'number' ? errorRate : ''}</td>
${showMode ? `<td>${MODE_TO_ELEMENT[mode]}</td>` : ''}
${showRemove ? `<td><button onclick='removeLevel(${JSON.stringify(_id)}, ${JSON.stringify(authWr)})'>×</button></td>` : ''}
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
