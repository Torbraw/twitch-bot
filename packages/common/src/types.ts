import { CustomCommand, Prisma } from '@prisma/client';
import { Output } from 'valibot';
import {
  UpdateCustomCommandSchema,
  CreateCustomCommandSchema,
  CreateAccessTokenSchema,
  UpdateAccessTokenSchema,
} from './schemas';

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

export type CreateAccessToken = Satisfies<
  Output<typeof CreateAccessTokenSchema>,
  Omit<Prisma.AccessTokenCreateInput, 'userId'>
>;
export type UpdateAccessToken = Satisfies<
  Output<typeof UpdateAccessTokenSchema>,
  Omit<Prisma.AccessTokenUpdateInput, 'userId'>
>;

export type CreateCustomCommand = Satisfies<Output<typeof CreateCustomCommandSchema>, Prisma.CustomCommandCreateInput>;
export type UpdateCustomCommand = Satisfies<Output<typeof UpdateCustomCommandSchema>, Pick<CustomCommand, 'content'>>;
