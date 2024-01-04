import { callApi, getCustomCommands } from '../utils/utils';
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { getBaseCommands } from '../utils/utils';
import { BotCommand } from './bot-command';
import { BotCommandContext } from './bot-command-context';
import { CommandMatch } from '../types';
import logger from '../utils/logger';
import { AccessTokenWithScopes, UpsertAccessToken } from 'common';

export class Bot {
  //#region Base Properties & constructor
  private readonly _api: ApiClient;
  private readonly _chat: ChatClient;
  private readonly _authProvider: RefreshingAuthProvider;
  private readonly _baseCommands: BotCommand[];
  private _customCommands: Map<string, BotCommand[]> = new Map<string, BotCommand[]>();

  public get api(): ApiClient {
    return this._api;
  }

  public constructor() {
    const authProvider = new RefreshingAuthProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: (userId, tokenData) => {
        const scopes = tokenData.scope.map((scope) => ({
          name: scope,
        }));

        callApi(`access-tokens/${userId}`, 'POST', {
          accessToken: tokenData.accessToken,
          expiresIn: tokenData.expiresIn,
          obtainmentTimestamp: tokenData.obtainmentTimestamp,
          refreshToken: tokenData.refreshToken,
          scopes: {
            connect: scopes,
          },
        } satisfies UpsertAccessToken).catch((e) => {
          logger.handleError(e);
        });
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
    this._customCommands = await getCustomCommands();

    const userId = process.env.TWITCH_USER_ID as string;
    const accessToken = await callApi<AccessTokenWithScopes>(`access-tokens/${userId}`, 'GET', null);
    if ('statusCode' in accessToken) {
      return false;
    }

    this._authProvider.addUser(
      userId,
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
  //#endregion

  //#region Private Methods
  private handleOnMessage = async (channel: string, user: string, text: string, msg: PrivateMessage) => {
    const match = this.findMatch(text, msg.channelId || '');
    if (match) {
      await match.command.execute(
        new BotCommandContext({
          bot: this,
          channel,
          user,
          args: match.args,
          msg,
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
