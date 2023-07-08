import { RefreshingAuthProvider } from '@twurple/auth';
import { prisma } from 'database';
import { setAccessToken } from './src/utils';
import { ChatClient } from '@twurple/chat';

void (async () => {
  const authProvider = new RefreshingAuthProvider({
    clientId: process.env.TWITCH_CLIENT_ID as string,
    clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onRefresh: async (userId, newTokenData) => await setAccessToken(userId, newTokenData),
  });

  const userId = process.env.TWITCH_USER_ID as string;
  const accessToken = await prisma.accessToken.findUnique({
    where: { userId: userId },
    include: { scopes: true },
  });
  if (!accessToken) throw new Error('No access token found');

  authProvider.addUser(
    userId,
    {
      expiresIn: accessToken.expiresIn,
      refreshToken: accessToken.refreshToken,
      accessToken: accessToken.accessToken,
      obtainmentTimestamp: Number(accessToken.obtainmentTimestamp),
      scope: accessToken.scopes.map((scope) => scope.name),
    },
    ['chat'],
  );

  const chatClient = new ChatClient({ authProvider, channels: ['torbraw'], authIntents: ['chat'] });
  await chatClient.connect();

  chatClient.onMessage((channel, user, text, msg) => {
    console.log({
      channel,
      user,
      text,
      msg,
    });
  });
})();
