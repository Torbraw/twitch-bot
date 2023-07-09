import { BotCommandContext } from '../models/bot-command-context';
import { BotCommand } from '../models/bot-command';

export class FollowerCountCommand extends BotCommand {
  public constructor() {
    super({
      name: 'follower-count',
      description: 'Shows the current follower count',
      aliases: ['fc'],
    });
  }

  public async execute(context: BotCommandContext) {
    const followerCount = await context.bot.api.channels.getChannelFollowerCount(context.broadcasterId);
    await context.bot.reply(
      context.channel,
      `There are currently ${followerCount} followers for this channel.`,
      context.msg,
    );
  }
}
