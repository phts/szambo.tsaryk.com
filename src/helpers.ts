import {RemoteControl} from './models'

export function generateRcId(item: RemoteControl) {
  const {when} = item
  return [
    when.getFullYear(),
    (when.getMonth() + 1).toString().padStart(2, '0'),
    when.getDay().toString().padStart(2, '0'),
    when.getHours().toString().padStart(2, '0'),
    when.getMinutes().toString().padStart(2, '0'),
    when.getSeconds().toString().padStart(2, '0'),
  ].join('')
}

export function actionWithPayloadToString(action: string, payload?: string | null) {
  return `"${action}"${payload ? ` with payload "${payload}"` : ''}`
}

export function percentageToCubeMeters(capacity: number, value: number) {
  return (value * capacity) / 100
}

export function calcDeviation(samples: number[]) {
  const mean = samples.reduce((sum, x) => sum + x, 0) / samples.length
  return Math.sqrt(samples.map((x) => Math.pow(x - mean, 2)).reduce((sum, x) => sum + x, 0) / samples.length)
}
