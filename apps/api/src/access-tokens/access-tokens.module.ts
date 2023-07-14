import { Module } from '@nestjs/common';
import { AccessTokensService } from './access-tokens.service';
import { AccessTokensController } from './access-tokens.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AccessTokensController],
  providers: [AccessTokensService],
  imports: [PrismaModule],
})
export class AccessTokensModule {}
