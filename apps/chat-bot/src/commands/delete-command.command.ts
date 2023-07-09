import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { prisma } from 'database';

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
      await prisma.customCommand.delete({
        where: {
          channelId_name: {
            channelId: context.broadcasterId,
            name: commandName,
          },
        },
      });

      await context.bot.say(context.channel, `The command ${commandName} was deleted.`);
    } catch (e) {
      console.error(e);
      await context.bot.say(context.channel, `An error occurred while deleting the command ${commandName}.`);
    }
  }
}
