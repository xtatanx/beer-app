import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      firstName: string;
      lastName: string;
    } & DefaultSession['user'];
  }

  interface User {
    firstName: string;
    lastName: string;
  }

  interface Profile {
    given_name: string;
    family_name: string;
    picture: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    firstName: string;
    lastName: string;
  }
}
