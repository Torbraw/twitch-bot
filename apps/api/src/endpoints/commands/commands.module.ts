import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { CommandsService } from './commands.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService],
  imports: [PrismaModule],
})
export class CommandsModule {}
