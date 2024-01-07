import { object, string, number, array } from 'valibot';

export const UpsertAccessTokenSchema = object({
  accessToken: string(),
  expiresIn: number(),
  obtainmentTimestamp: number(),
  refreshToken: string(),
  scopes: object({
    connect: array(object({ name: string() })),
  }),
});
