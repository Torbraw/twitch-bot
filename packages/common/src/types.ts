import { CustomCommand, Prisma } from '@prisma/client';

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

const accessTokenWithScopes = {
  scopes: true,
} satisfies Prisma.AccessTokenInclude;
export type AccessTokenWithScopes = Prisma.AccessTokenGetPayload<{
  include: typeof accessTokenWithScopes;
}>;

export type UpdateCustomCommand = Pick<CustomCommand, 'content'>;

export type UpsertAccessToken = Omit<Prisma.AccessTokenCreateInput, 'userId'>;
