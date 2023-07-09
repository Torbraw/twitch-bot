import { PrivateMessage } from '@twurple/chat';
import { Bot } from './models/bot';
import { BotCommand } from './models/bot-command';

export type CommandMatch = {
  command: BotCommand;
  args: string[];
};

export type BotCommandOptions = {
  name: string;
  description?: string;
  aliases?: string[];
};

export type BotCommandContextOptions = {
  bot: Bot;
  channel: string;
  user: string;
  args: string[];
  msg: PrivateMessage;
};
