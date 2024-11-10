export interface Config {
  db: {
    uri: string
  }
}

export function getConfig(): Config {
  const {DB_URI} = process.env
  if (!DB_URI) {
    throw new Error('DB_URI env variable is missing')
  }
  return {db: {uri: DB_URI}}
}
