export function tzOffsetToIsoTimezone(tzo: number) {
  const pad = function (num: number): string {
    return (num < 10 ? '0' : '') + num
  }
  const dif = tzo < 0 ? '+' : '-'
  return dif + pad(Math.floor(Math.abs(tzo) / 60)) + ':' + pad(Math.abs(tzo) % 60)
}
