import {
  object,
  string,
  number,
  array,
  minLength,
  minValue,
  integer,
  maxLength,
  StringSchema,
  maxValue,
} from 'valibot';

const DEFAULT_STRING: StringSchema = string([
  minLength(1, 'Must not be empty'),
  maxLength(191, 'Exceeds max length of 191'),
]);
const DEFAULT_POSITIVE_NUMBER = number([
  minValue(0, 'Must be a positive number'),
  integer('Must be an integer'),
  maxValue(2147483647, 'Exceeds max value of 2147483647'),
]);

export const UpsertAccessTokenSchema = object({
  accessToken: DEFAULT_STRING,
  expiresIn: DEFAULT_POSITIVE_NUMBER,
  obtainmentTimestamp: DEFAULT_POSITIVE_NUMBER,
  refreshToken: DEFAULT_STRING,
  scopes: object({
    connect: array(object({ name: DEFAULT_STRING })),
  }),
});
