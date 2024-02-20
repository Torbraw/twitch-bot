import { PrismaClient } from 'common';

// TODO, create DB user that can only access access_tokens table and use it here
export const prisma = new PrismaClient();
