import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

const API = process.env.BACKEND_API_URL!;
const SECRET = process.env.NEXTAUTH_SECRET!;

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
    Credentials({
      name: "EmailPassword",
      credentials: { email: {}, password: {}, mode: {} }, // mode: "register"|"login"
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const path =
          creds.mode === "register"
            ? "/api/auth/email/register"
            : "/api/auth/email/login";
        const raw = JSON.stringify({
          email: creds.email,
          password: creds.password,
        });
        const r = await fetch(`${API}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: raw,
        });
        if (!r.ok) return null;
        const { user_id } = await r.json();
        return { id: String(user_id), email: String(creds.email) }; // ← これが user.id になる
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 10 },
  secret: SECRET,

  callbacks: {
    async signIn({ account, user }) {
      if (!account) return true; // credentials などは別経路

      const api = API;
      const body = JSON.stringify({
        provider: account.provider,
        providerSub: account.providerAccountId, // 決定的ID
        email: user.email ?? null,
        name: user.name ?? null,
      });

      const r = await fetch(`${api}/api/bff/auth/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!r.ok) return false;

      const { railsUserId, access, refresh, access_exp } = await r.json();
      user.userId = String(railsUserId); // 初回の受け渡し
      user.railsAccess = access; // BFF専用。sessionには出さない
      user.railsAccessExp = access_exp;
      user.railsRefresh = refresh;
      return true;
    },

    async jwt({ token, user, account }) {
      // 初回だけ user→token へコピー
      if (user?.userId) token.userId = user.userId;
      if (user?.railsAccess) {
        token.railsAccess = user.railsAccess;
        token.railsAccessExp = user.railsAccessExp;
        token.railsRefresh = user.railsRefresh;
      }
      // プロバイダ情報は保持（ネットワーク呼び出しはしない）
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token ?? token.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.userId = token.userId;
      session.provider = token.provider;
      // railsAccess/refresh は出さない（クライアント非公開）
      return session;
    },
  },
} satisfies NextAuthOptions;
