import { CustomCommand, Prisma } from '@prisma/client';

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type AccessTokenWithScopes = {
  obtainedTimestamp: number;
} & Prisma.AccessTokenGetPayload<{
  select: {
    userId: true;
    accessToken: true;
    refreshToken: true;
    expiresIn: true;
    scopes: {
      select: {
        name: true;
      };
    };
  };
}>;

export type UpdateCustomCommand = Pick<CustomCommand, 'content'>;

export type UpsertAccessToken = Omit<Prisma.AccessTokenCreateInput, 'userId'>;
