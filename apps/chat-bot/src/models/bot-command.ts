import { BotCommandOptions } from '../types';
import { BotCommandContext } from './bot-command-context';

export abstract class BotCommand {
  private _name: string;
  private _description?: string;
  private _aliases?: string[];

  public get name(): string {
    return this._name;
  }

  public get description(): string | undefined {
    return this._description;
  }

  public get aliases(): string[] | undefined {
    return this._aliases;
  }

  public constructor(options: BotCommandOptions) {
    this._name = options.name;
    this._description = options.description;
    this._aliases = options.aliases;
  }

  public doesMatchName(name: string): boolean | undefined {
    return name == this.name || this.aliases?.includes(name);
  }

  public abstract execute(context: BotCommandContext): void | Promise<void>;
}
