import { Bot } from './src/models/bot';
import logger from './src/lib/logger';

void (async () => {
  logger.logInfo('Starting bot');
  const bot = new Bot();
  const isStarted = await bot.init();
  if (isStarted) {
    logger.logInfo('Bot is running');
  } else {
    logger.logError('Bot failed to start');
  }
})();
