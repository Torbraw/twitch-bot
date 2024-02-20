import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { CustomCommand } from 'common';

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

    if (!/^[a-zA-Z0-9_]+$/.test(commandName)) {
      await context.bot.say(context.channel, 'The command name can only contain letters, numbers and underscores.');
      return;
    }

    const result = await context.bot.callApi<CustomCommand>(
      `commands/${context.broadcasterId}/${commandName}`,
      'DELETE',
      null,
    );
    if ('statusCode' in result) {
      if (result.code === 'P2025') {
        await context.bot.say(
          context.channel,
          `The command ${commandName} that you are trying to delete does not exist.`,
        );
        return;
      }

      await context.bot.say(context.channel, `An error occurred while deleting the command ${commandName}.`);
      return;
    }

    context.bot.removeCustomCommand(context.broadcasterId, commandName);
    await context.bot.say(context.channel, `The command ${commandName} was deleted.`);
  }
}
