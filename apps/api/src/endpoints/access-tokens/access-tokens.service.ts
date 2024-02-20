import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccessToken } from 'common';

@Injectable()
export class AccessTokensService {
  public constructor(private prisma: PrismaService) {}

  public async isAccessTokenValid(token: string): Promise<boolean> {
    const accessToken = await this.prisma.accessToken.findFirst({
      where: {
        accessToken: token,
      },
    });

    if (!accessToken) {
      return false;
    }

    // No need to checks expiration, since the bot does it
    return true;
  }

  public async createAccessToken(userId: string, data: CreateAccessToken): Promise<void> {
    await this.prisma.accessToken.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}
