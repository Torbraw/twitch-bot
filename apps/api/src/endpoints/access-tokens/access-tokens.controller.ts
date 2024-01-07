import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccessTokensService } from './access-tokens.service';
import { AccessTokenWithScopes, UpsertAccessToken, UpsertAccessTokenSchema } from 'common';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';

@Controller('access-tokens')
export class AccessTokensController {
  public constructor(private readonly accessTokensService: AccessTokensService) {}

  @Get(':userId')
  public async getAccessToken(@Param('userId') userId: string): Promise<AccessTokenWithScopes> {
    return await this.accessTokensService.getAccessToken(userId);
  }

  @Post(':userId')
  public async createOrUpdateAccessToken(
    @Param('userId') userId: string,
    @Body(new ValibotValidationPipe(UpsertAccessTokenSchema)) data: UpsertAccessToken,
  ): Promise<void> {
    await this.accessTokensService.createOrUpdateAccessToken(userId, data);
  }
}
