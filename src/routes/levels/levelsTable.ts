import {ObjectId} from 'mongodb'
import {Level, LevelMode} from '../../models'
import {percentageToCubeMeters, calcRange} from '../../helpers'

export interface LevelViewModel {
  raw: {
    _id: ObjectId
    when: Date
    value: number
    m3: number
    delta: number
    errorRate: number | null
    range: number | null
    mode: LevelMode
  }
  warning: boolean
  when: string
  delta: string
  deltaLow?: boolean
  deltaNegative?: boolean
  m3: string
  errorRate: string
  range: string
  samples: string
  mode: string
}

export interface LevelsTableData {
  levels: LevelViewModel[]
  showMode: boolean
  showRemove: boolean
  showDelta: boolean
  showErrorRate: boolean
  showRange: boolean
  authWr?: string
  warningHighErrorRate: number
  warningHighRange: number
}

const MODE_TO_ELEMENT = {
  [LevelMode.Auto]: '<span title="Auto">⏰</span>',
  [LevelMode.Manual]: '<span title="Manual">⚡️</span>',
} as const

export function toViewModel(
  levels: Level[],
  {capacity, warningLevel}: {capacity: number; warningLevel: number}
): LevelViewModel[] {
  return levels.reduce((acc, x) => {
    const m3 = percentageToCubeMeters(capacity, x.value)
    const range = x.samples ? calcRange(x.samples) : null
    if (acc.length) {
      const nextEntry = acc[acc.length - 1]
      const delta = nextEntry.raw.m3 - m3
      nextEntry.deltaLow = delta > -0.1 && delta <= 0.01
      nextEntry.deltaNegative = delta <= -0.1
      nextEntry.delta = delta.toFixed(2)
    }

    acc.push({
      raw: {
        ...x,
        value: Math.round(x.value),
        m3,
        delta: 0,
        range,
      },
      when: x.when.toLocaleString('ru'),
      warning: x.value >= warningLevel,
      m3: m3.toFixed(2),
      delta: '',
      errorRate: typeof x.errorRate === 'number' ? x.errorRate.toString() : '',
      mode: MODE_TO_ELEMENT[x.mode],
      samples: x.samples ? x.samples.join(', ') : '',
      range: range === null ? '' : range.toFixed(2),
    })
    return acc
  }, [] as LevelViewModel[])
}

const valueClass = (value: number | null, thresholds: [number, number]): string => {
  if (typeof value !== 'number') {
    return ''
  }
  if (value >= thresholds[1]) {
    return 'highValue'
  } else if (value >= thresholds[0]) {
    return 'mediumValue'
  }
  return 'lowValue'
}

export function levelsTable({
  levels,
  showMode,
  showDelta,
  showRemove,
  showRange,
  showErrorRate,
  authWr,
  warningHighErrorRate,
  warningHighRange,
}: LevelsTableData) {
  const ths = [
    'When',
    '%',
    'm&sup3;',
    showDelta ? ['Δm&sup3;', 'Delta'] : null,
    showErrorRate ? ['⚠%', 'Error rate'] : null,
    showRange ? 'Range' : null,
    showMode ? 'Mode' : null,
    showRemove ? 'Remove' : null,
  ]
    .filter(Boolean)
    .map((x) => (Array.isArray(x) ? `<th title="${x[1]}">${x[0]}</th>` : `<th>${x}</th>`))
    .join('')
  return `<table class="levels" border=1>
<tr>${ths}</tr>
${levels
  .map(({raw, when, m3, delta, deltaNegative, deltaLow, errorRate, range, samples, mode, warning}) => {
    const props = warning ? ` class="warn"` : ''
    const tds = [
      `<td>${when}</td>`,
      `<td>${raw.value}</td>`,
      `<td>${m3}</td>`,
      showDelta ? `<td class="${deltaNegative ? 'negativeDelta' : deltaLow ? 'lowValue' : ''}">${delta}</td>` : '',
      showErrorRate ? `<td class=${valueClass(raw.errorRate, [15, warningHighErrorRate])}>${errorRate}</td>` : '',
      showRange ? `<td class="${valueClass(raw.range, [3, warningHighRange])}" title="${samples}">${range}</td>` : '',
      showMode ? `<td>${mode}</td>` : '',
      showRemove
        ? `<td><button onclick='removeLevel(${JSON.stringify(raw._id)}, ${JSON.stringify(authWr)})'>×</button></td>`
        : '',
    ]
    return `<tr${props}>${tds.join('')}</tr>`
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
