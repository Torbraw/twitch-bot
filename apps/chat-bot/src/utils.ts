import { AccessToken } from '@twurple/auth';
import { prisma } from 'database';
import { DiceCommand } from './commands/dice.command';
import { BotCommand } from './models/bot-command';
import { FollowerCountCommand } from './commands/follower-count.command';

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

export const getBaseCommands = () => {
  const commands = new Map<string, BotCommand>();
  commands.set('dice', new DiceCommand());
  commands.set('follower-count', new FollowerCountCommand());

  return commands;
};
