import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomCommand, Prisma, UpdateCustomCommand } from 'common';

@Injectable()
export class CommandsService {
  public constructor(private prisma: PrismaService) {}

  public async getCommands(): Promise<CustomCommand[]> {
    return await this.prisma.customCommand.findMany({});
  }

  public async createCommand(data: Prisma.CustomCommandCreateInput): Promise<CustomCommand> {
    data.name = data.name.toLowerCase();

    return await this.prisma.customCommand.create({
      data: data,
    });
  }

  public async updateCommand(channelId: string, name: string, data: UpdateCustomCommand): Promise<CustomCommand> {
    return await this.prisma.customCommand.update({
      where: {
        channelId_name: {
          channelId: channelId,
          name: name,
        },
      },
      data: {
        content: data.content,
      },
    });
  }

  public async deleteCommand(channelId: string, name: string): Promise<CustomCommand> {
    return await this.prisma.customCommand.delete({
      where: {
        channelId_name: {
          channelId: channelId,
          name: name,
        },
      },
    });
  }
}
