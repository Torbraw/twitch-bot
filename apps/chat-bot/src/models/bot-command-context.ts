import { PrivateMessage, toUserName } from '@twurple/chat';
import { Bot } from './bot';

export class BotCommandContext {
  private readonly _bot: Bot;
  private readonly _msg: PrivateMessage;

  public get bot(): Bot {
    return this._bot;
  }

  public get msg(): PrivateMessage {
    return this._msg;
  }

  public get channel(): string {
    return toUserName(this._msg.target.value);
  }

  public constructor(bot: Bot, msg: PrivateMessage) {
    this._bot = bot;
    this._msg = msg;
  }
}
