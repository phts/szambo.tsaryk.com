export interface Config {
  db: {
    uri: string
  }
  emails: {
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
    highDiff: {
      subject: string
      text: string
    }
  }
  levels: {
    warningAt: number
    warningHighDiffPerHour: number
  }
  auth: {
    rd: string
    wr: string
  }
}

export function getConfig(): Config {
  const {
    DB_URI,
    EMAILS_HOST,
    EMAILS_PORT,
    EMAILS_USER,
    EMAILS_PASS,
    EMAILS_FROM,
    EMAILS_TO,
    EMAILS_LEVEL_SUBJECT,
    EMAILS_LEVEL_TEXT,
    EMAILS_FATAL_SUBJECT,
    EMAILS_FATAL_TEXT,
    EMAILS_HIGH_DIFF_SUBJECT,
    EMAILS_HIGH_DIFF_TEXT,
    LEVELS_WARNING_AT,
    LEVELS_WARNING_HIGH_DIFF_PER_HOUR,
    APP_AUTH_WR,
    APP_AUTH_RD,
  } = process.env
  if (!DB_URI) {
    throw new Error('DB_URI env variable is missing')
  }
  if (!EMAILS_HOST) {
    throw new Error('EMAILS_HOST env variable is missing')
  }
  if (!EMAILS_PORT) {
    throw new Error('EMAILS_PORT env variable is missing')
  }
  if (!EMAILS_USER) {
    throw new Error('EMAILS_USER env variable is missing')
  }
  if (!EMAILS_PASS) {
    throw new Error('EMAILS_PASS env variable is missing')
  }
  if (!EMAILS_FROM) {
    throw new Error('EMAILS_FROM env variable is missing')
  }
  if (!EMAILS_TO) {
    throw new Error('EMAILS_TO env variable is missing')
  }
  if (!EMAILS_LEVEL_SUBJECT) {
    throw new Error('EMAILS_SUBJECT env variable is missing')
  }
  if (!EMAILS_LEVEL_TEXT) {
    throw new Error('EMAILS_TEXT env variable is missing')
  }
  if (!EMAILS_FATAL_SUBJECT) {
    throw new Error('EMAILS_FATAL_SUBJECT env variable is missing')
  }
  if (!EMAILS_FATAL_TEXT) {
    throw new Error('EMAILS_FATAL_TEXT env variable is missing')
  }
  if (!EMAILS_HIGH_DIFF_SUBJECT) {
    throw new Error('EMAILS_HIGH_DIFF_SUBJECT env variable is missing')
  }
  if (!EMAILS_HIGH_DIFF_TEXT) {
    throw new Error('EMAILS_HIGH_DIFF_TEXT env variable is missing')
  }
  if (!LEVELS_WARNING_AT) {
    throw new Error('LEVELS_WARNING_AT env variable is missing')
  }
  if (!LEVELS_WARNING_HIGH_DIFF_PER_HOUR) {
    throw new Error('LEVELS_WARNING_HIGH_DIFF_PER_HOUR env variable is missing')
  }
  if (!APP_AUTH_WR) {
    throw new Error('APP_AUTH_WR env variable is missing')
  }
  if (!APP_AUTH_RD) {
    throw new Error('APP_AUTH_RD env variable is missing')
  }
  return {
    db: {uri: DB_URI},
    emails: {
      host: EMAILS_HOST,
      port: parseInt(EMAILS_PORT),
      user: EMAILS_USER,
      pass: EMAILS_PASS,
      from: EMAILS_FROM,
      to: EMAILS_TO,
      level: {
        subject: EMAILS_LEVEL_SUBJECT,
        text: EMAILS_LEVEL_TEXT,
      },
      fatal: {
        subject: EMAILS_FATAL_SUBJECT,
        text: EMAILS_FATAL_TEXT,
      },
      highDiff: {
        subject: EMAILS_HIGH_DIFF_SUBJECT,
        text: EMAILS_HIGH_DIFF_TEXT,
      },
    },
    levels: {
      warningAt: parseInt(LEVELS_WARNING_AT),
      warningHighDiffPerHour: parseInt(LEVELS_WARNING_HIGH_DIFF_PER_HOUR),
    },
    auth: {
      rd: APP_AUTH_RD,
      wr: APP_AUTH_WR,
    },
  }
}
