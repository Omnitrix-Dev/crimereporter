import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import DiscordProvider from "next-auth/providers/discord";
import CredentialProvider from "next-auth/providers/credentials";
// @ts-expect-error: error external lib
import bcrypt from "bcryptjs";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    DiscordProvider,
    CredentialProvider({
      id: "credentials",
      name: "Login with email",
      credentials: {
        name: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
        email: {
          label: "Email",
          type: "email",
        },
      },
      async authorize(credentials) {
        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email));

          console.log("user db", user);

          console.log("password credential/client", credentials.password);
          console.log("password db", user[0]!.password);

          if (
            !user[0] ||
            !bcrypt.compareSync(credentials.password, user[0].password)
          ) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
          }

          return {
            id: user[0]!.id,
            name: user[0]!.name,
            email: user[0]!.email,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    // session: ({ session, user }) => ({
    //   ...session,
    //   user: {
    //     ...session.user,
    //     id: user.id,
    //   },
    // }),
    session: async ({ session, token }) => {
      const user = await db.select().from(users).where(eq(users.id, token.sub));

      return {
        ...session,
        user: {
          ...session.user,
          id: user[0]!.id,
          current_user: user[0]!,
        },
      };
    },
  },
} satisfies NextAuthConfig;
