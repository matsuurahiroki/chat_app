import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

const FRONT = process.env.NEXTAUTH_URL!;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),

    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),

    CredentialsProvider({
      name: "EmailPassword",
      credentials: {
        email: {},
        password: {},
        name: {},
        mode: {},
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const path =
          credentials.mode === "register"
            ? `${FRONT}/api/bff/auth/signup`
            : `${FRONT}/api/bff/auth/login`;

        const res = await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Rails signup error:", text);
          return null;
        }
        const data = await res.json();

        const id = data.user?.id ?? data.id; //railsから帰ってきたユーザーオブジェクト
        const userId = data.user?.id ?? data.id;
        const email = data.user?.email ?? data.email;
        const name = data.user?.name ?? data.name;
        return {
          id, // NextAuth内部用
          userId, // 自前フィールド
          email,
          name,
        };
      },
    }),
  ],

  session: { strategy: "jwt", maxAge: 60 * 60 },

  callbacks: {
    async signIn({ account, user }) {
      if (!account) return true;

      if (account.provider === "credentials") {
        return true;
      }

      const body = JSON.stringify({
        provider: account.provider,
        providerSub: account.providerAccountId,
        email: user.email ?? null,
        name: user.name ?? null,
      });

      const r = await fetch(`${FRONT}/api/bff/auth/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-BFF-Token": process.env.BFF_SHARED_TOKEN ?? "",
        },
        body,
      });

      if (!r.ok) return false;

      const { railsUserId, access, refresh, access_exp } = await r.json();
      user.userId = String(railsUserId);
      user.railsAccess = access;
      user.railsAccessExp = access_exp;
      user.railsRefresh = refresh;

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const u = user;
        token.userId = u.userId ?? token.userId;
        token.name = u.name ?? token.name;
        token.email = u.email ?? token.email;
      }

      if (user?.railsAccess) {
        token.railsAccess = user.railsAccess;
        token.railsAccessExp = user.railsAccessExp;
        token.railsRefresh = user.railsRefresh;
      }

      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token ?? token.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.userId = token.userId;
      session.provider = token.provider;
      session.user = {
        ...session.user,
        name: token.name ?? session.user?.name,
        email: token.email ?? session.user?.email,
      };
      return session;
    },
  },
} satisfies NextAuthOptions;
