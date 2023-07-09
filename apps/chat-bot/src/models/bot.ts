/* eslint-disable @typescript-eslint/no-misused-promises */
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { getBasicCommands, setAccessToken } from '../utils';
import { prisma } from 'database';
import { BotCommand } from './bot-command';
import { BotCommandContext } from './bot-command-context';

export class Bot {
  private readonly _api: ApiClient;
  private readonly _chat: ChatClient;
  private readonly _authProvider: RefreshingAuthProvider;
  private readonly _commands: Map<string, BotCommand> = new Map();

  public constructor() {
    const authProvider = new RefreshingAuthProvider({
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: async (userId, newTokenData) => await setAccessToken(userId, newTokenData),
    });

    this._authProvider = authProvider;

    this._commands = getBasicCommands();

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

  public handleOnMessage = async (channel: string, user: string, text: string, msg: PrivateMessage) => {
    const match = this.findMatch(text);
    if (match) {
      await match.command.execute(match.params, new BotCommandContext(this, msg));
    }
  };

  public say = async (channel: string, message: string) => {
    console.log(`Saying ${message} in ${channel}`);
    await this._chat.say(channel, message);
  };

  private findMatch(text: string) {
    const line = text.trim().replace(/  +/g, ' ');
    for (const command of this._commands.values()) {
      const [enteredCommand, ...params] = line.split(' ');
      if (!enteredCommand.startsWith('!') || enteredCommand.slice(1) !== command.name) {
        continue;
      }

      return {
        command,
        params,
      };
    }
    return null;
  }
}
