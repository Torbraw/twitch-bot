import { CustomCommand, Prisma } from '@prisma/client';
import { UpsertAccessTokenSchema, UpdateCustomCommandSchema, CreateCustomCommandSchema } from './schemas';
import { Output } from 'valibot';

type Satisfies<T extends U, U> = T;

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type AccessTokenWithScopes = {
  obtainmentTimestamp: number;
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

export type UpdateCustomCommand = Satisfies<Output<typeof UpdateCustomCommandSchema>, Pick<CustomCommand, 'content'>>;
export type CreateCustomCommand = Satisfies<Output<typeof CreateCustomCommandSchema>, Prisma.CustomCommandCreateInput>;

export type UpsertAccessToken = Satisfies<
  Output<typeof UpsertAccessTokenSchema>,
  Omit<Prisma.AccessTokenCreateInput, 'userId'>
>;
