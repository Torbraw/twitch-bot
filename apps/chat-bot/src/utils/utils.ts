import { CustomCommand, ExceptionResponse } from 'common';
import { BASE_API_URL } from '../config';
import { BotCommand } from '../models/bot-command';
import { FollowerCountCommand } from '../commands/follower-count.command';
import { AddCommandCommand } from '../commands/add-command.command';
import { EditCommandCommand } from '../commands/edit-command.command';
import { DeleteCommandCommand } from '../commands/delete-command.command';
import { BotCommandContext } from '../models/bot-command-context';
import logger from './logger';

export const getBaseCommands = (): BotCommand[] => {
  return [new FollowerCountCommand(), new AddCommandCommand(), new EditCommandCommand(), new DeleteCommandCommand()];
};

export const getCustomCommands = async () => {
  const commandsMap = new Map<string, BotCommand[]>();

  const customCommands = await callApi<CustomCommand[]>('commands', 'GET', null);
  if ('statusCode' in customCommands) {
    return commandsMap;
  }

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

export const callApi = async <T = Record<string, never>>(
  url: string,
  method: string,
  body: unknown,
): Promise<T | ExceptionResponse> => {
  try {
    const response = await fetch(`${BASE_API_URL}/${url}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json() as Promise<T | ExceptionResponse>;
    }
    return {} as T;
  } catch (error) {
    logger.handleError(error);
    return {
      statusCode: 500,
      message: 'Internal server error',
    };
  }
};
