import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from './types';
import { AccessTokensService } from 'src/endpoints/access-tokens/access-tokens.service';

@Injectable()
export class TwitchBotGuard implements CanActivate {
  public constructor(private accessTokenService: AccessTokensService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!type || type.toLowerCase() !== 'bearer' || !token) {
      return false;
    }
    return await this.accessTokenService.isAccessTokenValid(token);
  }
}
