import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenWithScopes, Prisma } from 'common';

@Injectable()
export class AccessTokensService {
  public constructor(private prisma: PrismaService) {}

  public async getAccessToken(userId: string): Promise<AccessTokenWithScopes> {
    const accessToken = await this.prisma.accessToken.findUnique({
      where: {
        userId: userId,
      },
      include: {
        scopes: true,
      },
    });
    if (!accessToken) {
      throw new NotFoundException('Access token not found');
    }
    return accessToken;
  }

  public async createOrUpdateAccessToken(userId: string, data: Prisma.AccessTokenCreateInput): Promise<void> {
    await this.prisma.accessToken.upsert({
      where: { userId },
      create: data,
      update: data,
    });
  }
}
