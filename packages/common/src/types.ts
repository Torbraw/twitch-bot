import { CustomCommand } from '@prisma/client';

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  code?: string;
};

export type UpdateCustomCommand = Pick<CustomCommand, 'content'>;
