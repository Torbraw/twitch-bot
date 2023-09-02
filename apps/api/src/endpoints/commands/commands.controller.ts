import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomCommand, Prisma, UpdateCustomCommand } from 'common';
import { CommandsService } from './commands.service';

@Controller('commands')
export class CommandsController {
  public constructor(private commandsService: CommandsService) {}

  @Get()
  public async getCommands(): Promise<CustomCommand[]> {
    return await this.commandsService.getCommands();
  }

  @Post()
  public async createCommand(@Body() data: Prisma.CustomCommandCreateInput): Promise<CustomCommand> {
    return await this.commandsService.createCommand(data);
  }

  @Patch(':channelId/:name')
  public async updateCommand(
    @Param('channelId') channelId: string,
    @Param('name') name: string,
    @Body() data: UpdateCustomCommand,
  ): Promise<CustomCommand> {
    return await this.commandsService.updateCommand(channelId, name, data);
  }

  @Delete(':channelId/:name')
  public async deleteCommand(
    @Param('channelId') channelId: string,
    @Param('name') name: string,
  ): Promise<CustomCommand> {
    return await this.commandsService.deleteCommand(channelId, name);
  }
}
