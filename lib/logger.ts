type LogData = Record<string, unknown>

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.DEBUG

const resolveMinLogLevel = (): number => {
  const envLevel = (process.env.NEX_PUBLIC_LOG_LEVEL || DEFAULT_LOG_LEVEL).toLowerCase() as LogLevel
  return LOG_LEVEL_VALUES[envLevel] ?? LOG_LEVEL_VALUES[DEFAULT_LOG_LEVEL]
}

const minLogLevel = resolveMinLogLevel()

type LoggerFn = (message: string, data?: LogData) => void

export const createLogger = (context: string) => {
  const shouldLog = (level: LogLevel): boolean => LOG_LEVEL_VALUES[level] >= minLogLevel

  const format = (level: LogLevel, message: string): string => `[${level.toUpperCase()}] [${context}] ${message}`
  const emit = (level: LogLevel, message: string, data?: LogData): void => {
    const formatted = format(level, message)
    const output = data ? [formatted, data] : [formatted]

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...output)
        break
      case LogLevel.INFO:
        console.info(...output)
        break
      case LogLevel.WARN:
        console.warn(...output)
        break
      case LogLevel.ERROR:
        console.error(...output)
        break
    }
  }

  const log =
    (level: LogLevel): LoggerFn =>
    (message, data) => {
      if (shouldLog(level)) {
        emit(level, message, data)
      }
    }
  return {
    debug: log(LogLevel.DEBUG),
    info: log(LogLevel.INFO),
    warn: log(LogLevel.WARN),
    error: log(LogLevel.ERROR),
  }
}
