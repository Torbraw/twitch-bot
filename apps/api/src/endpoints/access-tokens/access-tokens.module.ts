import { Global, Module } from '@nestjs/common';
import { AccessTokensService } from './access-tokens.service';
import { AccessTokensController } from './access-tokens.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  controllers: [AccessTokensController],
  providers: [AccessTokensService],
  exports: [AccessTokensService],
  imports: [PrismaModule],
})
export class AccessTokensModule {}
