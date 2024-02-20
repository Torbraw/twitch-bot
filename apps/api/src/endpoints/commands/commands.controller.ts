import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  CustomCommand,
  UpdateCustomCommand,
  CreateCustomCommand,
  CreateCustomCommandSchema,
  UpdateCustomCommandSchema,
} from 'common';
import { CommandsService } from './commands.service';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';
import { TwitchBotGuard } from 'src/lib/twich-bot.guard';

@Controller('commands')
export class CommandsController {
  public constructor(private commandsService: CommandsService) {}

  @Post()
  @UseGuards(TwitchBotGuard)
  public async createCommand(
    @Body(new ValibotValidationPipe(CreateCustomCommandSchema)) data: CreateCustomCommand,
  ): Promise<CustomCommand> {
    return await this.commandsService.createCommand(data);
  }

  @Patch(':channelId/:name')
  @UseGuards(TwitchBotGuard)
  public async updateCommand(
    @Param('channelId') channelId: string,
    @Param('name') name: string,
    @Body(new ValibotValidationPipe(UpdateCustomCommandSchema)) data: UpdateCustomCommand,
  ): Promise<CustomCommand> {
    return await this.commandsService.updateCommand(channelId, name, data);
  }

  @Delete(':channelId/:name')
  @UseGuards(TwitchBotGuard)
  public async deleteCommand(
    @Param('channelId') channelId: string,
    @Param('name') name: string,
  ): Promise<CustomCommand> {
    return await this.commandsService.deleteCommand(channelId, name);
  }
}
