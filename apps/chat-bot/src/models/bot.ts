import { createBotCommandFromCustomCommand } from '../lib/utils';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { getBaseCommands } from '../lib/utils';
import { BotCommand } from './bot-command';
import { BotCommandContext } from './bot-command-context';
import { CommandMatch } from '../types';
import logger from '../lib/logger';
import { prisma } from '../lib/prisma';
import { ExceptionResponse } from 'common';
import { BASE_API_URL } from '../config';

const TWITCH_USER_ID = process.env.TWITCH_USER_ID as string;

export class Bot {
  //#region Base Properties & constructor
  private readonly _api: ApiClient;
  private readonly _chat: ChatClient;
  private readonly _authProvider: RefreshingAuthProvider;
  private readonly _baseCommands: BotCommand[];
  private _customCommands: Map<string, BotCommand[]> = new Map<string, BotCommand[]>();
  private _accessToken: string | undefined;

  public get api(): ApiClient {
    return this._api;
  }

  public constructor() {
    const authProvider = new RefreshingAuthProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: (userId, tokenData) => {
        prisma.accessToken
          .update({
            where: { userId },
            data: {
              accessToken: tokenData.accessToken,
              expiresIn: tokenData.expiresIn,
              obtainmentTimestamp: tokenData.obtainmentTimestamp,
              refreshToken: tokenData.refreshToken,
            },
          })
          .catch((e) => {
            logger.handleError(e);
          });
        this._accessToken = tokenData.accessToken;
      },
    });

    this._authProvider = authProvider;

    this._baseCommands = getBaseCommands();

    this._api = new ApiClient({ authProvider: authProvider });

    this._chat = new ChatClient({ authProvider, channels: ['torbraw'], authIntents: ['chat'] });

    this._chat.onMessage((channel, user, text, msg) => {
      this.handleOnMessage(channel, user, text, msg).catch((e) => {
        logger.handleError(e);
      });
    });

    this._chat.onConnect(() => {
      logger.logInfo('Successfully connected to chat');
    });
  }
  //#endregion

  //#region Public Methods
  /**
   * Initialize the bot with values that need async calls
   */
  public init = async () => {
    this._customCommands = await this.getCustomCommands();

    const accessToken = await prisma.accessToken.findUnique({
      where: {
        userId: TWITCH_USER_ID,
      },
      include: {
        scopes: true,
      },
    });
    if (!accessToken) {
      logger.logError('No access token found');
      return false;
    }

    this._accessToken = accessToken.accessToken;
    this._authProvider.addUser(
      TWITCH_USER_ID,
      {
        expiresIn: accessToken.expiresIn,
        refreshToken: accessToken.refreshToken,
        accessToken: accessToken.accessToken,
        obtainmentTimestamp: Number(accessToken.obtainmentTimestamp),
        scope: accessToken.scopes.map((scope) => scope.name),
      },
      ['chat'],
    );

    await this._chat.connect();

    return true;
  };

  public addCustomCommand = (channelId: string, command: BotCommand) => {
    const commands = this._customCommands.get(channelId) ?? [];
    commands.push(command);
    this._customCommands.set(channelId, commands);
  };

  public removeCustomCommand = (channelId: string, commandName: string) => {
    const commands = this._customCommands.get(channelId) ?? [];
    const newCommands = commands.filter((command) => command.name !== commandName);
    this._customCommands.set(channelId, newCommands);
  };

  public say = async (channel: string, message: string) => {
    await this._chat.say(channel, message);
  };

  public reply = async (channel: string, text: string, replyMessage: PrivateMessage) => {
    await this._chat.say(channel, text, { replyTo: replyMessage });
  };

  public callApi = async <T = Record<string, never>>(
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
          Authorization: `Bearer ${this._accessToken ?? ''}`,
        },
      });
      if (!response.ok) {
        return {
          statusCode: response.status,
          message: response.statusText,
        };
      }

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

  //#endregion

  //#region Private Methods
  private getCustomCommands = async () => {
    const commandsMap = new Map<string, BotCommand[]>();
    const customCommands = await prisma.customCommand.findMany({});
    for (const command of customCommands) {
      const cmds = commandsMap.get(command.channelId) ?? [];
      cmds.push(createBotCommandFromCustomCommand(command));
      commandsMap.set(command.channelId, cmds);
    }

    return commandsMap;
  };

  private handleOnMessage = async (channel: string, user: string, text: string, msg: PrivateMessage) => {
    const match = this.findMatch(text, msg.channelId ?? '');
    if (match) {
      await match.command.execute(
        new BotCommandContext({
          bot: this,
          channel,
          user,
          args: match.args,
          msg,
          userId: msg.userInfo.userId,
        }),
      );
    }
  };

  private findMatch(text: string, channelId: string): CommandMatch | null {
    const line = text.trim().replace(/  +/g, ' ');
    const [enteredCommand, ...args] = line.split(' ');

    if (!enteredCommand.startsWith('!')) {
      return null;
    }
    const commandName = enteredCommand.slice(1);

    for (const command of this._baseCommands) {
      if (command.doesMatchName(commandName)) {
        return {
          command,
          args,
        };
      }
    }

    for (const customCommand of this._customCommands.get(channelId) || []) {
      if (customCommand.doesMatchName(commandName)) {
        return {
          command: customCommand,
          args,
        };
      }
    }

    return null;
  }
  //#endregion
}
