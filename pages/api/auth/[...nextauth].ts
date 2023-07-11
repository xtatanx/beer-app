import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '../../../lib/mongodb';
import { getUser, updateUser } from '../../../lib/userService';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'beer-app',
  }),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          firstName: profile.given_name ?? '',
          lastName: profile.family_name ?? '',
          profileImage: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user: connectedUser, profile }) {
      const user = await getUser(connectedUser.email as string);
      const hasBasicData =
        user?.profileImage && user?.firstName && user?.lastName && user?.name;

      if (!hasBasicData && profile) {
        await updateUser(connectedUser.email as string, {
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          profileImage: profile.picture,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;

      return session;
    },
  },
  theme: {
    colorScheme: 'light',
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
};

export default NextAuth(authOptions);
