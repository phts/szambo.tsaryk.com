export interface Config {
  db: {
    uri: string
  }
  email: {
    host: string
    port: number
    user: string
    pass: string
    from: string
    to: string
    subject: string
    text: string
  }
  warningLevel: number
  auth: string
}

export function getConfig(): Config {
  const {
    DB_URI,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
    EMAIL_TO,
    EMAIL_SUBJECT,
    EMAIL_TEXT,
    WARNING_LEVEL,
    APP_AUTH,
  } = process.env
  if (!DB_URI) {
    throw new Error('DB_URI env variable is missing')
  }
  if (!EMAIL_HOST) {
    throw new Error('EMAIL_HOST env variable is missing')
  }
  if (!EMAIL_PORT) {
    throw new Error('EMAIL_PORT env variable is missing')
  }
  if (!EMAIL_USER) {
    throw new Error('EMAIL_USER env variable is missing')
  }
  if (!EMAIL_PASS) {
    throw new Error('EMAIL_PASS env variable is missing')
  }
  if (!EMAIL_FROM) {
    throw new Error('EMAIL_FROM env variable is missing')
  }
  if (!EMAIL_TO) {
    throw new Error('EMAIL_TO env variable is missing')
  }
  if (!EMAIL_SUBJECT) {
    throw new Error('EMAIL_SUBJECT env variable is missing')
  }
  if (!EMAIL_TEXT) {
    throw new Error('EMAIL_TEXT env variable is missing')
  }
  if (!WARNING_LEVEL) {
    throw new Error('WARNING_LEVEL env variable is missing')
  }
  if (!APP_AUTH) {
    throw new Error('APP_AUTH env variable is missing')
  }
  return {
    db: {uri: DB_URI},
    email: {
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT),
      user: EMAIL_USER,
      pass: EMAIL_PASS,
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: EMAIL_SUBJECT,
      text: EMAIL_TEXT,
    },
    warningLevel: parseInt(WARNING_LEVEL),
    auth: APP_AUTH,
  }
}
