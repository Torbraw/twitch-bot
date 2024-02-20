import { PrivateMessage } from '@twurple/chat';
import { Bot } from './bot';
import { BotCommandContextOptions } from '../types';

export class BotCommandContext {
  //#region Base Properties & constructor
  private readonly _bot: Bot;
  private readonly _msg: PrivateMessage;
  private readonly _channel: string;
  private readonly _user: string;
  private readonly _userId: string;
  private readonly _args: string[];

  public get bot(): Bot {
    return this._bot;
  }

  public get msg(): PrivateMessage {
    return this._msg;
  }

  public get user(): string {
    return this._user;
  }

  public get channel(): string {
    return this._channel;
  }

  public get args(): string[] {
    return this._args;
  }

  public get userId(): string {
    return this._userId;
  }

  public constructor(options: BotCommandContextOptions) {
    this._bot = options.bot;
    this._args = options.args;
    this._channel = options.channel;
    this._user = options.user;
    this._userId = options.userId;
    this._msg = options.msg;
  }
  //#endregion

  public get broadcasterId(): string {
    return this.msg.channelId || '';
  }
}
