// src/lib/nextauth/auth.ts
import type { NextAuthOptions, User, Session, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

const FRONT = process.env.NEXTAUTH_URL!;

// アプリが使うユーザー型：Rails の users.id を userId に入れる
type AppUser = User & {
  userId: string; // Rails users.id（文字列）
};

// JWT にも userId を足す（name/email は NextAuth 側ですでに定義済み）
type AppJWT = JWT & {
  userId?: string;
};

// Session にも userId を足す
type AppSession = Session & {
  userId?: string;
};

// Rails から返ってくる想定の JSON
type RailsAuthResponse = {
  id?: number | string; // Rails users.id
  email?: string;
  name?: string;
};

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

      // メール & パスワードでの認証
      async authorize(credentials): Promise<AppUser | null> {
        // email / password が無ければ即失敗
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 新規登録かログインかで叩く BFF を変える
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

        const text = await res.text();

        if (!res.ok) {
          console.error(
            "[AUTH][Credentials] Rails signup/login error:",
            res.status,
            text
          );
          return null; // => CredentialsSignin
        }

        // Rails のレスポンスをパース（失敗しても落とさない）
        let data: RailsAuthResponse = {};
        try {
          data = JSON.parse(text) as RailsAuthResponse;
        } catch (err) {
          console.warn(
            "[AUTH][Credentials] Rails response is not JSON, raw text:",
            text,
            err
          );
        }

        // ★ id は必ず Rails の users.id を使う（email を代わりにしない）
        if (data.id == null) {
          console.error(
            "[AUTH][Credentials] Rails response has no id. Abort login.",
            data
          );
          return null;
        }

        const id = String(data.id);

        const email: string | undefined =
          data.email ?? (credentials.email as string | undefined);

        const name: string | null =
          data.name ?? (credentials.name as string | undefined) ?? null;

        if (!email) {
          console.error(
            "[AUTH][Credentials] Missing email after normalize",
            data
          );
          return null;
        }

        // ★ NextAuth に返すユーザー
        //   - id: NextAuth 内部用
        //   - userId: アプリが使うID（Rails users.id）
        const user: AppUser = {
          id,
          userId: id,
          email,
          name,
        };

        return user;
      },
    }),
  ],

  // セッションは JWT 方式
  session: { strategy: "jwt", maxAge: 60 * 60 },

  callbacks: {
    // OAuth (Google / X) のときだけ Rails に upsert して userId をもらう
    async signIn({ account, user }) {
      if (!account) return true;

      if (account.provider === "credentials") {
        // メール & パスワードのときは authorize で既に Rails と同期済み
        return true;
      }

      const acc = account as Account;
      const appUser = user as AppUser;

      const body = JSON.stringify({
        provider: acc.provider,
        providerSub: acc.providerAccountId,
        email: appUser.email ?? null,
        name: appUser.name ?? null,
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

      const { railsUserId } = (await r.json()) as {
        railsUserId: string | number;
      };

      // ★ OAuth のときも userId は Rails の users.id に統一
      appUser.userId = String(railsUserId);

      return true;
    },

    // ★ JWT に userId / name / email をコピー
    async jwt({ token, user, session, trigger }) {
      const t = token as AppJWT;

      if (user) {
        const u = user as AppUser;

        if (u.userId) {
          t.userId = u.userId;
        }
        if (u.name !== undefined) {
          t.name = u.name;
        }
        if (u.email !== undefined) {
          t.email = u.email;
        }
      }

      // ★ プロフィール更新後の useSession().update(...) から来るパス
      if (trigger === "update" && session) {
        if (session.name) {
          t.name = session.name as string;
        }
        if (session.email) {
          t.email = session.email as string;
        }
      }

      return t;
    },

    // ★ Session に userId / name / email を流し込む
    async session({ session, token }) {
      const t = token as AppJWT;
      const s = session as AppSession;

      // アプリが使う ID は常に userId
      s.userId = t.userId;

      const currentUser = s.user ?? {};

      s.user = {
        ...currentUser,
        name: t.name ?? currentUser.name ?? null,
        email: t.email ?? currentUser.email ?? null,
      };

      return s;
    },
  },
} satisfies NextAuthOptions;
