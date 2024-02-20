import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { CustomCommand } from 'common';
import { createBotCommandFromCustomCommand } from '../lib/utils';

export class AddCommandCommand extends BotCommand {
  public constructor() {
    super({
      name: 'add-command',
      description: 'Create a new command, pass in the command name and the response separated by a space',
      aliases: ['add-cmd', 'addcmd', 'acmd'],
    });
  }

  public async execute(context: BotCommandContext) {
    const [commandName, ...args] = context.args;

    if (!commandName || args.length === 0) {
      await context.bot.say(context.channel, 'Please provide a command name and a response.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(commandName)) {
      await context.bot.say(context.channel, 'The command name can only contain letters, numbers and underscores.');
      return;
    }

    const newCommand = await context.bot.callApi<CustomCommand>('commands', 'POST', {
      channelId: context.broadcasterId,
      name: commandName,
      content: args.join(' '),
    });
    if ('statusCode' in newCommand) {
      if (newCommand.code === 'P2002') {
        await context.bot.say(
          context.channel,
          `The command ${commandName} already exists, use !edit-command to edit it.`,
        );
        return;
      }

      await context.bot.say(context.channel, `An error occurred while adding the command ${commandName}.`);
      return;
    }

    context.bot.addCustomCommand(context.broadcasterId, createBotCommandFromCustomCommand(newCommand));
    await context.bot.say(context.channel, `The command ${commandName} was added.`);
  }
}
