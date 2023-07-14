import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';
import { AccessTokensModule } from './access-tokens/access-tokens.module';

@Module({
  imports: [CommandsModule, AccessTokensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
