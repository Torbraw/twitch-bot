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
  union,
  null_,
} from 'valibot';

const DEFAULT_STRING: StringSchema = string([
  minLength(1, 'Must not be empty'),
  maxLength(191, 'Exceeds max length of 191'),
]);
const DEFAULT_POSITIVE_NUMBER = (v = 2147483647) =>
  number([
    minValue(0, 'Must be a positive number'),
    integer('Must be an integer'),
    maxValue(v, 'Exceeds max value of 2147483647'),
  ]);

export const UpsertAccessTokenSchema = object({
  accessToken: DEFAULT_STRING,
  expiresIn: union([DEFAULT_POSITIVE_NUMBER(), null_()]),
  obtainmentTimestamp: DEFAULT_POSITIVE_NUMBER(9007199254740991),
  refreshToken: union([DEFAULT_STRING, null_()]),
  scopes: object({
    connect: array(object({ name: DEFAULT_STRING })),
  }),
});

export const UpdateCustomCommandSchema = object({
  content: DEFAULT_STRING,
});

export const CreateCustomCommandSchema = object({
  content: DEFAULT_STRING,
  channelId: DEFAULT_STRING,
  name: DEFAULT_STRING,
});
