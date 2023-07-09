import { Prisma, prisma } from '.';

const accessTokenScopes: Prisma.AccessTokenScopeCreateManyInput[] = [
  {
    name: 'chat:edit',
  },
  {
    name: 'chat:read',
  },
  {
    name: 'moderator:read:followers',
  },
];

async function main() {
  await prisma.accessTokenScope.createMany({
    data: accessTokenScopes,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
