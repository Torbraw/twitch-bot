import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenWithScopes, CreateAccessToken, UpdateAccessToken } from 'common';

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

    return {
      ...accessToken,
      obtainmentTimestamp: Number(accessToken.obtainmentTimestamp),
    };
  }

  public async createAccessToken(userId: string, data: CreateAccessToken): Promise<void> {
    await this.prisma.accessToken.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  public async updateAccessToken(userId: string, data: UpdateAccessToken): Promise<void> {
    await this.prisma.accessToken.update({
      where: { userId },
      data,
    });
  }
}
