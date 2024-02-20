import { CustomCommand } from 'common';
import { BotCommand } from '../models/bot-command';
import { FollowerCountCommand } from '../commands/follower-count.command';
import { AddCommandCommand } from '../commands/add-command.command';
import { EditCommandCommand } from '../commands/edit-command.command';
import { DeleteCommandCommand } from '../commands/delete-command.command';
import { BotCommandContext } from '../models/bot-command-context';

export const getBaseCommands = (): BotCommand[] => {
  return [new FollowerCountCommand(), new AddCommandCommand(), new EditCommandCommand(), new DeleteCommandCommand()];
};

export const createBotCommandFromCustomCommand = (command: CustomCommand): BotCommand => {
  return new (class extends BotCommand {
    public constructor() {
      super({
        name: command.name,
      });
    }

    public async execute(context: BotCommandContext) {
      await context.bot.say(context.channel, command.content);
    }
  })();
};
