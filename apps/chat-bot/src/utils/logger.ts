import winston from 'winston';

/**
 * Class used to implement winston logger and use it in the bot globally
 */
export class Logger {
  /**
   * Instance of the winston logger
   */
  private logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: process.env.LOGGER_LEVEL })],
    format: winston.format.printf((log) => `[${log.level.toUpperCase()}] - ${log.message as string}`),
  });

  /**
   * Log the passed message as "info"
   * @param message
   */
  public logInfo(message: string): void {
    this.logger.log('info', message);
  }

  /**
   * Log the passed message as "warn"
   * @param message
   */
  public logWarn(message: string): void {
    this.logger.log('warn', message);
  }

  /**
   * Log the passed message as "error"
   * @param message
   */
  public logError(message: string): void {
    this.logger.log('error', message);
  }

  /**
   * Take the passed error and log it accordingly
   * @param error
   * @param message
   */
  public handleError(error: unknown): void {
    if (error instanceof Error) {
      logger.logError(`${error.message} \n ----- \n ${error.stack || ''}`);
    } else {
      this.logger.log('error', error);
    }
  }

  /**
   * Log the passed message as "debug"
   * @param message
   */
  public logDebug(message: string): void {
    this.logger.log('debug', message);
  }
}

const logger = new Logger();
export default logger;
