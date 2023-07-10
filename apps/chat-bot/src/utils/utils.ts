import { AccessToken } from '@twurple/auth';
import { CustomCommand, prisma } from 'database';
import { BotCommand } from '../models/bot-command';
import { FollowerCountCommand } from '../commands/follower-count.command';
import { AddCommandCommand } from '../commands/add-command.command';
import { EditCommandCommand } from '../commands/edit-command.command';
import { DeleteCommandCommand } from '../commands/delete-command.command';
import { BotCommandContext } from '../models/bot-command-context';

export const setAccessToken = async (userId: string, tokenData: AccessToken) => {
  const scopes = tokenData.scope.map((scope) => ({
    name: scope,
  }));

  await prisma.accessToken.upsert({
    where: { userId },
    create: {
      userId,
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      obtainmentTimestamp: tokenData.obtainmentTimestamp,
      refreshToken: tokenData.refreshToken,
      scopes: {
        connect: scopes,
      },
    },
    update: {
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      obtainmentTimestamp: tokenData.obtainmentTimestamp,
      refreshToken: tokenData.refreshToken,
      scopes: {
        connect: scopes,
      },
    },
  });
};

export const getBaseCommands = (): BotCommand[] => {
  return [new FollowerCountCommand(), new AddCommandCommand(), new EditCommandCommand(), new DeleteCommandCommand()];
};

export const getCustomCommands = async () => {
  const commandsMap = new Map<string, BotCommand[]>();

  const customCommands = await prisma.customCommand.findMany({});

  for (const command of customCommands) {
    const cmds = commandsMap.get(command.channelId) || [];
    cmds.push(createBotCommandFromCustomCommand(command));
    commandsMap.set(command.channelId, cmds);
  }

  return commandsMap;
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
