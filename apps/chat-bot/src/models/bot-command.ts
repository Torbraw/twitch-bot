import { BotCommandContext } from './bot-command-context';

export abstract class BotCommand {
  private _name: string;
  private _description: string;

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }

  public constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  public abstract execute(params: string[], context: BotCommandContext): void | Promise<void>;
}
