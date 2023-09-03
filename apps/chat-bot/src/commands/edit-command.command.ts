import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import logger from '../utils/logger';
import { callApi } from '../utils/utils';

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
      await callApi(`commands/${context.broadcasterId}/${commandName}`, 'PUT', response);

      await context.bot.say(context.channel, `The command ${commandName} was edited.`);
    } catch (e) {
      logger.handleError(e);
      await context.bot.say(context.channel, `An error occurred while editing the command ${commandName}.`);
    }
  }
}
