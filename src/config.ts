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
    level: {
      subject: string
      text: string
    }
    fatal: {
      subject: string
      text: string
    }
  }
  warningLevel: number
  auth: {
    rd: string
    wr: string
  }
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
    EMAIL_LEVEL_SUBJECT,
    EMAIL_LEVEL_TEXT,
    EMAIL_FATAL_SUBJECT,
    EMAIL_FATAL_TEXT,
    WARNING_LEVEL,
    APP_AUTH_WR,
    APP_AUTH_RD,
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
  if (!EMAIL_LEVEL_SUBJECT) {
    throw new Error('EMAIL_SUBJECT env variable is missing')
  }
  if (!EMAIL_LEVEL_TEXT) {
    throw new Error('EMAIL_TEXT env variable is missing')
  }
  if (!EMAIL_FATAL_SUBJECT) {
    throw new Error('EMAIL_FATAL_SUBJECT env variable is missing')
  }
  if (!EMAIL_FATAL_TEXT) {
    throw new Error('EMAIL_FATAL_TEXT env variable is missing')
  }
  if (!WARNING_LEVEL) {
    throw new Error('WARNING_LEVEL env variable is missing')
  }
  if (!APP_AUTH_WR) {
    throw new Error('APP_AUTH_WR env variable is missing')
  }
  if (!APP_AUTH_RD) {
    throw new Error('APP_AUTH_RD env variable is missing')
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
      level: {
        subject: EMAIL_LEVEL_SUBJECT,
        text: EMAIL_LEVEL_TEXT,
      },
      fatal: {
        subject: EMAIL_FATAL_SUBJECT,
        text: EMAIL_FATAL_TEXT,
      },
    },
    warningLevel: parseInt(WARNING_LEVEL),
    auth: {
      rd: APP_AUTH_RD,
      wr: APP_AUTH_WR,
    },
  }
}
