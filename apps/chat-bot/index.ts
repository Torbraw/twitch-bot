import { Bot } from './src/models/bot';

void (async () => {
  const bot = new Bot();
  await bot.init();

  console.log('Bot started');
})();
