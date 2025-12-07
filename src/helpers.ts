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

export function calcRange(samples: number[]) {
  return samples[samples.length - 1] - samples[0]
}
