import { Bot } from './src/models/bot';
import logger from './src/utils/logger';

void (async () => {
  logger.logInfo('Starting bot');
  const bot = new Bot();
  const isStarted = await bot.init();
  if (isStarted) {
    logger.logInfo('Bot is running');
  }
})();
