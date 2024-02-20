import { Body, Controller, Param, Post } from '@nestjs/common';
import { AccessTokensService } from './access-tokens.service';
import { CreateAccessToken, CreateAccessTokenSchema } from 'common';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';

@Controller('access-tokens')
export class AccessTokensController {
  public constructor(private readonly accessTokensService: AccessTokensService) {}

  // TODO: Add a admin guard
  @Post(':userId')
  public async createAccessToken(
    @Param('userId') userId: string,
    @Body(new ValibotValidationPipe(CreateAccessTokenSchema)) data: CreateAccessToken,
  ): Promise<void> {
    await this.accessTokensService.createAccessToken(userId, data);
  }
}
