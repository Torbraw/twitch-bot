import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { prisma } from 'database';
import logger from '../utils/logger';

export class EditCommandCommand extends BotCommand {
  public constructor() {
    super({
      name: 'edit-command',
      description: 'Edit a command, pass in the command name and the response separated by a space',
      aliases: ['edit-cmd', 'editcmd', 'ecmd'],
    });
  }

  public async execute(context: BotCommandContext) {
    const [commandName, response] = context.args;

    if (!commandName || !response) {
      await context.bot.say(context.channel, 'Please provide a command name and a response.');
      return;
    }

    try {
      await prisma.customCommand.update({
        where: {
          channelId_name: {
            channelId: context.broadcasterId,
            name: commandName,
          },
        },
        data: {
          content: response,
        },
      });

      await context.bot.say(context.channel, `The command ${commandName} was edited.`);
    } catch (e) {
      logger.handleError(e);
      await context.bot.say(context.channel, `An error occurred while editing the command ${commandName}.`);
    }
  }
}
