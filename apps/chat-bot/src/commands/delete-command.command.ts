import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { Prisma } from 'common';
import logger from '../utils/logger';
import { callApi } from '../utils/utils';

export class DeleteCommandCommand extends BotCommand {
  public constructor() {
    super({
      name: 'del-command',
      description: 'Delete a command, pass in the command name',
      aliases: ['del-cmd', 'delcmd', 'dcmd'],
    });
  }

  public async execute(context: BotCommandContext) {
    const [commandName] = context.args;

    if (!commandName) {
      await context.bot.say(context.channel, 'Please provide a command name.');
      return;
    }

    try {
      await callApi(`commands/${context.broadcasterId}/${commandName}`, 'DEL', null);

      context.bot.removeCustomCommand(context.broadcasterId, commandName);
      await context.bot.say(context.channel, `The command ${commandName} was deleted.`);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          await context.bot.say(context.channel, `The command ${commandName} you are trying to delete does not exist.`);
          return;
        }
      }

      logger.handleError(e);
      await context.bot.say(context.channel, `An error occurred while deleting the command ${commandName}.`);
    }
  }
}
