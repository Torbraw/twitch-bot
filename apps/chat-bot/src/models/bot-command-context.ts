import { PrivateMessage } from '@twurple/chat';
import { Bot } from './bot';
import { BotCommandContextOptions } from '../types';

export class BotCommandContext {
  //#region Base Properties
  private readonly _bot: Bot;
  private readonly _msg: PrivateMessage;
  private readonly _channel: string;
  private readonly _user: string;
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

  public get args(): string[] {
    return this._args;
  }
  //#endregion

  public get channel(): string {
    return this._channel;
  }

  public get broadcasterId(): string {
    return this.msg.channelId || '';
  }

  public constructor(options: BotCommandContextOptions) {
    this._bot = options.bot;
    this._args = options.args;
    this._channel = options.channel;
    this._user = options.user;
    this._msg = options.msg;
  }
}
