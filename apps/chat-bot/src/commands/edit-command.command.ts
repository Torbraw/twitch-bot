import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { callApi } from '../utils/utils';
import { CustomCommand } from 'common';

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

    if (!/^[a-zA-Z0-9_]+$/.test(commandName)) {
      await context.bot.say(context.channel, 'The command name can only contain letters, numbers and underscores.');
      return;
    }

    const result = await callApi<CustomCommand>(`commands/${context.broadcasterId}/${commandName}`, 'PATCH', response);
    if ('statusCode' in result) {
      if (result.code === 'P2025') {
        await context.bot.say(
          context.channel,
          `The command ${commandName} that you are trying to edit does not exist.`,
        );
        return;
      }

      await context.bot.say(context.channel, `An error occurred while editing the command ${commandName}.`);
      return;
    }

    await context.bot.say(context.channel, `The command ${commandName} was edited.`);
  }
}
