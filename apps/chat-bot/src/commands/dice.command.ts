import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from './../models/bot-command';

export class DiceCommand extends BotCommand {
  public constructor() {
    super('dice', 'Rolls a dice');
  }

  public async execute(params: string[], context: BotCommandContext) {
    await context.bot.say(context.channel, `You rolled a ${Math.floor(Math.random() * 6) + 1}`);

    console.log('Dice command executed');
  }
}
