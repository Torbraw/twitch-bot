import { prisma } from 'database';
import { Token } from './types';

export const setAccessToken = async (userId: string, tokenData: Token) => {
  const scopes = tokenData.scope.map((scope) => ({
    name: scope,
  }));

  await prisma.accessToken.upsert({
    where: { userId },
    create: {
      userId,
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      obtainmentTimestamp: tokenData.obtainmentTimestamp,
      refreshToken: tokenData.refreshToken,
      scopes: {
        connect: scopes,
      },
    },
    update: {
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      obtainmentTimestamp: tokenData.obtainmentTimestamp,
      refreshToken: tokenData.refreshToken,
      scopes: {
        connect: scopes,
      },
    },
  });
};
