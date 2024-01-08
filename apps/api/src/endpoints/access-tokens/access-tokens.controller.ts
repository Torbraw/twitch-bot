import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AccessTokensService } from './access-tokens.service';
import {
  AccessTokenWithScopes,
  UpdateAccessToken,
  CreateAccessToken,
  UpdateAccessTokenSchema,
  CreateAccessTokenSchema,
} from 'common';
import { ValibotValidationPipe } from 'src/lib/valibot-validation.pipe';

@Controller('access-tokens')
export class AccessTokensController {
  public constructor(private readonly accessTokensService: AccessTokensService) {}

  @Get(':userId')
  public async getAccessToken(@Param('userId') userId: string): Promise<AccessTokenWithScopes> {
    return await this.accessTokensService.getAccessToken(userId);
  }

  @Post(':userId')
  public async createAccessToken(
    @Param('userId') userId: string,
    @Body(new ValibotValidationPipe(CreateAccessTokenSchema)) data: CreateAccessToken,
  ): Promise<void> {
    await this.accessTokensService.createAccessToken(userId, data);
  }

  @Put(':userId')
  public async updateAccessToken(
    @Param('userId') userId: string,
    @Body(new ValibotValidationPipe(UpdateAccessTokenSchema)) data: UpdateAccessToken,
  ): Promise<void> {
    await this.accessTokensService.updateAccessToken(userId, data);
  }
}
