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
    highDiff: {
      subject: string
      text: string
    }
    unstable: {
      subject: string
      text: string
    }
    unstableResolved: {
      subject: string
      text: string
    }
  }
  levels: {
    capacity: number
    trimSamples: number
    warningAt: number
    warningHighDiffPerHour: number
    warningHighErrorRate: number
    warningHighRange: number
  }
  deviceHealth: {
    minSequentialFailures: number
  }
  deviceConnection: {
    interval: number
  }
  auth: {
    rd: string
    wr: string
  }
  home: {
    levelsAmount: number
    logsAmount: number
  }
  version: string
}

export function getConfig(): Config {
  const {
    APP_AUTH_WR,
    APP_AUTH_RD,
    APP_VERSION,
    DB_URI,
    EMAILS_HOST,
    EMAILS_PORT,
    EMAILS_USER,
    EMAILS_PASS,
    EMAILS_FROM,
    EMAILS_TO,
    EMAILS_LEVEL_SUBJECT,
    EMAILS_LEVEL_TEXT,
    EMAILS_HIGH_DIFF_SUBJECT,
    EMAILS_HIGH_DIFF_TEXT,
    EMAILS_UNSTABLE_SUBJECT,
    EMAILS_UNSTABLE_TEXT,
    EMAILS_UNSTABLE_RESOLVED_SUBJECT,
    EMAILS_UNSTABLE_RESOLVED_TEXT,
    LEVELS_CAPACITY,
    LEVELS_WARNING_AT,
    LEVELS_WARNING_HIGH_DIFF_PER_HOUR,
    LEVELS_WARNING_HIGH_ERROR_RATE,
    LEVELS_WARNING_HIGH_RANGE,
    LEVELS_TRIM_SAMPLES,
    DEVICE_HEALTH_MIN_SEQUENTIAL_FAILURES,
    DEVICE_CONNECTION_INTERVAL,
    HOME_LEVELS_AMOUNT,
    HOME_LOGS_AMOUNT,
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
  if (!EMAILS_HIGH_DIFF_SUBJECT) {
    throw new Error('EMAILS_HIGH_DIFF_SUBJECT env variable is missing')
  }
  if (!EMAILS_HIGH_DIFF_TEXT) {
    throw new Error('EMAILS_HIGH_DIFF_TEXT env variable is missing')
  }
  if (!EMAILS_UNSTABLE_SUBJECT) {
    throw new Error('EMAILS_UNSTABLE_SUBJECT env variable is missing')
  }
  if (!EMAILS_UNSTABLE_TEXT) {
    throw new Error('EMAILS_UNSTABLE_TEXT env variable is missing')
  }
  if (!EMAILS_UNSTABLE_RESOLVED_SUBJECT) {
    throw new Error('EMAILS_UNSTABLE_RESOLVED_SUBJECT env variable is missing')
  }
  if (!EMAILS_UNSTABLE_RESOLVED_TEXT) {
    throw new Error('EMAILS_UNSTABLE_RESOLVED_TEXT env variable is missing')
  }
  if (!LEVELS_CAPACITY) {
    throw new Error('LEVELS_CAPACITY env variable is missing')
  }
  if (!LEVELS_TRIM_SAMPLES) {
    throw new Error('LEVELS_TRIM_SAMPLES env variable is missing')
  }
  if (!LEVELS_WARNING_AT) {
    throw new Error('LEVELS_WARNING_AT env variable is missing')
  }
  if (!LEVELS_WARNING_HIGH_DIFF_PER_HOUR) {
    throw new Error('LEVELS_WARNING_HIGH_DIFF_PER_HOUR env variable is missing')
  }
  if (!LEVELS_WARNING_HIGH_ERROR_RATE) {
    throw new Error('LEVELS_WARNING_HIGH_ERROR_RATE env variable is missing')
  }
  if (!LEVELS_WARNING_HIGH_RANGE) {
    throw new Error('LEVELS_WARNING_HIGH_RANGE env variable is missing')
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
      highDiff: {
        subject: EMAILS_HIGH_DIFF_SUBJECT,
        text: EMAILS_HIGH_DIFF_TEXT,
      },
      unstable: {
        subject: EMAILS_UNSTABLE_SUBJECT,
        text: EMAILS_UNSTABLE_TEXT,
      },
      unstableResolved: {
        subject: EMAILS_UNSTABLE_RESOLVED_SUBJECT,
        text: EMAILS_UNSTABLE_RESOLVED_TEXT,
      },
    },
    levels: {
      capacity: parseFloat(LEVELS_CAPACITY),
      trimSamples: parseInt(LEVELS_TRIM_SAMPLES),
      warningAt: parseInt(LEVELS_WARNING_AT),
      warningHighDiffPerHour: parseInt(LEVELS_WARNING_HIGH_DIFF_PER_HOUR),
      warningHighErrorRate: parseInt(LEVELS_WARNING_HIGH_ERROR_RATE),
      warningHighRange: parseInt(LEVELS_WARNING_HIGH_RANGE),
    },
    deviceHealth: {
      minSequentialFailures: parseInt(String(DEVICE_HEALTH_MIN_SEQUENTIAL_FAILURES)) || 3,
    },
    deviceConnection: {
      interval: parseInt(String(DEVICE_CONNECTION_INTERVAL)) || 24,
    },
    auth: {
      rd: APP_AUTH_RD,
      wr: APP_AUTH_WR,
    },
    home: {
      levelsAmount: parseInt(String(HOME_LEVELS_AMOUNT)) || 31,
      logsAmount: parseInt(String(HOME_LOGS_AMOUNT)) || 20,
    },
    version: APP_VERSION || 'unknown',
  }
}
