/* eslint-disable @typescript-eslint/no-misused-promises */
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { getBaseCommands, setAccessToken } from '../utils';
import { prisma } from 'database';
import { BotCommand } from './bot-command';
import { BotCommandContext } from './bot-command-context';
import { CommandMatch } from '../types';

export class Bot {
  private readonly _api: ApiClient;
  private readonly _chat: ChatClient;
  private readonly _authProvider: RefreshingAuthProvider;
  private readonly _baseCommands: Map<string, BotCommand> = new Map();

  public get api(): ApiClient {
    return this._api;
  }

  public constructor() {
    const authProvider = new RefreshingAuthProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: async (userId, newTokenData) => await setAccessToken(userId, newTokenData),
    });

    this._authProvider = authProvider;

    this._baseCommands = getBaseCommands();

    this._api = new ApiClient({ authProvider: authProvider });

    this._chat = new ChatClient({ authProvider, channels: ['torbraw'], authIntents: ['chat'] });

    this._chat.onMessage(async (channel, user, text, msg) => {
      await this.handleOnMessage(channel, user, text, msg);
    });

    this._chat.onConnect(() => {
      console.log('Successfully to chat');
    });
  }

  public init = async () => {
    const userId = process.env.TWITCH_USER_ID as string;
    const accessToken = await prisma.accessToken.findUnique({
      where: { userId: userId },
      include: { scopes: true },
    });
    if (!accessToken) throw new Error('No access token found');

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
  };

  public say = async (channel: string, message: string) => {
    await this._chat.say(channel, message);
  };

  public reply = async (channel: string, text: string, replyMessage: PrivateMessage) => {
    await this._chat.say(channel, text, { replyTo: replyMessage });
  };

  private handleOnMessage = async (channel: string, user: string, text: string, msg: PrivateMessage) => {
    const match = this.findMatch(text);
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

  private findMatch(text: string): CommandMatch | null {
    const line = text.trim().replace(/  +/g, ' ');
    for (const command of this._baseCommands.values()) {
      const [enteredCommand, ...args] = line.split(' ');

      if (enteredCommand.startsWith('!')) {
        const commandName = enteredCommand.slice(1);
        if (commandName == command.name || command.aliases?.includes(commandName)) {
          return {
            command,
            args,
          };
        }
      }
    }
    return null;
  }
}
