import { Bot } from './src/models/bot';
import logger from './src/utils/logger';

void (async () => {
  logger.logInfo('Starting bot');
  const bot = new Bot();
  await bot.init();
  logger.logInfo('Bot is running');
})();
