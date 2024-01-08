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

const defaultString: StringSchema = string([
  minLength(1, 'Must not be empty'),
  maxLength(191, 'Exceeds max length of 191'),
]);

const defaultPositiveNumber = (v = 2147483647) =>
  number([
    minValue(0, 'Must be a positive number'),
    integer('Must be an integer'),
    maxValue(v, 'Exceeds max value of 2147483647'),
  ]);

const accessTokenBaseSchema = {
  accessToken: defaultString,
  expiresIn: union([defaultPositiveNumber(), null_()]),
  obtainmentTimestamp: defaultPositiveNumber(9007199254740991),
  refreshToken: union([defaultString, null_()]),
};
export const CreateAccessTokenSchema = object({
  ...accessTokenBaseSchema,
  scopes: object({
    connect: array(object({ name: defaultString })),
  }),
});
export const UpdateAccessTokenSchema = object(accessTokenBaseSchema);

export const UpdateCustomCommandSchema = object({
  content: defaultString,
});
export const CreateCustomCommandSchema = object({
  content: defaultString,
  channelId: defaultString,
  name: defaultString,
});
