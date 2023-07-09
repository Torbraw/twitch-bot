import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';
import { Prisma, prisma } from 'database';

export class AddCommandCommand extends BotCommand {
  public constructor() {
    super({
      name: 'add-command',
      description: 'Create a new command, pass in the command name and the response separated by a space',
      aliases: ['add-cmd', 'addcmd', 'acmd'],
    });
  }

  public async execute(context: BotCommandContext) {
    const [commandName, response] = context.args;

    if (!commandName || !response) {
      await context.bot.say(context.channel, 'Please provide a command name and a response.');
      return;
    }

    try {
      await prisma.customCommand.create({
        data: {
          channelId: context.broadcasterId,
          name: commandName,
          content: response,
        },
      });

      await context.bot.say(context.channel, `The command ${commandName} was added.`);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          await context.bot.say(
            context.channel,
            `The command ${commandName} already exists, use !edit-command to edit it.`,
          );
          return;
        }
      }

      console.error(e);
      await context.bot.say(context.channel, `An error occurred while adding the command ${commandName}.`);
    }
  }
}
