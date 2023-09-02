import { Module } from '@nestjs/common';
import { CommandsModule } from './endpoints/commands/commands.module';
import { AccessTokensModule } from './endpoints/access-tokens/access-tokens.module';

@Module({
  imports: [CommandsModule, AccessTokensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
