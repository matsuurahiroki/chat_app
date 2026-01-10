// src/lib/nextauth/auth.ts

// NextAuth が標準で提供する型を import
import type { NextAuthOptions, User, Session, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";

// 各種プロバイダ（メールパスワード・Google・X）を利用
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

// フロントエンドのベースURL（例: http://localhost:80）
// BFF(API Route) にアクセスするときに使う
const FRONT = process.env.NEXTAUTH_URL!;

// ==============================
// 型定義（アプリ独自に拡張）
// ==============================

// アプリで使うユーザー型
// - NextAuth の User 型を拡張して
// - Rails の users.id を userId に保持する
type AppUser = User & {
  userId: string; // Rails users.id（文字列として扱う）
};

// JWT にも userId を持たせる
// - name / email は NextAuth 側で既に定義済みなので追記不要
type AppJWT = JWT & {
  userId?: string;
};

// セッションにも userId を持たせる
// - useSession() から取得できる session に含めるため
type AppSession = Session & {
  userId?: string;
};

// Rails から返ってくる認証系レスポンスの想定形
// - /api/bff/auth/signup
// - /api/bff/auth/login
// などの返り値
type RailsAuthResponse = {
  id?: number | string; // Rails users.id
  email?: string;
  name?: string;
};

// ==============================
// NextAuth のメイン設定
// ==============================
export const authOptions: NextAuthOptions = {
  // ------------------------------
  // 認証プロバイダの定義
  // ------------------------------
  providers: [
    // Google ログイン
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // ログイン時にアカウント選択を毎回表示
      authorization: { params: { prompt: "select_account" } },
    }),

    // X(Twitter) ログイン
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // OAuth 2.0 を使用
    }),

    // メールアドレス + パスワードの独自認証
    CredentialsProvider({
      // このプロバイダの名前（UI上に出る）
      name: "EmailPassword",

      // フロントから受け取る認証情報の定義（型のヒント用）
      credentials: {
        email: {},
        password: {},
        name: {},
        mode: {}, // "register"（新規登録） or "login"（ログイン）
      },

      // 実際の認証処理
      // - フロントから送られてきた email/password を使って
      // - BFF(API Route) 経由で Rails に問い合わせる
      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const isRegister = credentials.mode === "register";
        const path = isRegister
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

        // 失敗時（既存のままでOK）
        if (!res.ok) {
          let msg = "認証に失敗しました";
          try {
            const data = JSON.parse(text);
            if (Array.isArray(data?.errors) && data.errors.length > 0)
              msg = data.errors.join("\n");
            else if (typeof data?.error === "string") msg = data.error;
          } catch {
            console.error("[AUTH] Unexpected error response (not JSON):", text);
            msg = "予期しないエラーが発生しました";
          }
          throw new Error(msg);
        }

        // ★register成功：セッションを作らない（userを返さない）
        if (isRegister) {
          throw new Error("REGISTER_OK");
          // ここで return user をしないのが重要
        }

        // login成功：ここだけ user を返す
        let data: RailsAuthResponse = {};
        try {
          data = JSON.parse(text) as RailsAuthResponse;
        } catch {}
        if (data.id == null) return null;

        const id = String(data.id);
        const email = data.email ?? credentials.email;
        const name = data.name ?? credentials.name ?? null;
        if (!email) return null;

        return { id, userId: id, email, name };
      },
    }),
  ],

  // ------------------------------
  // セッションの方式
  // ------------------------------
  // - "jwt": セッション情報をサーバーではなく JWT に入れてブラウザ側に持たせる
  // - maxAge: JWT の有効期限（秒）→ ここでは 1時間 (60 * 60)
  session: { strategy: "jwt", maxAge: 60 * 60 },

  // ------------------------------
  // 各種コールバック
  // ------------------------------
  callbacks: {
    // signIn コールバック
    // - OAuth (Google / X) でログインしたときに
    // - Rails 側に /api/bff/auth/upsert を叩いて userId を払い出してもらう
    async signIn({ account, user }) {
      // account が無い場合は特に処理せず通す
      if (!account) return true;

      // Credentials（メール & パスワード）の場合
      // - authorize 内で既に Rails と同期しているので何もしない
      if (account.provider === "credentials") {
        return true;
      }

      // OAuth（Google / X）の場合はこちら
      const acc = account as Account;
      const appUser = user as AppUser;

      // Rails の upsert 用に送るデータ
      // - provider: "google" / "twitter"
      // - providerSub: Google/X 側のユーザーID
      // - email / name: 取れる範囲で渡す
      const body = JSON.stringify({
        provider: acc.provider,
        providerSub: acc.providerAccountId,
        email: appUser.email ?? null,
        name: appUser.name ?? null,
      });

      // BFF 経由で Rails の /api/auth/upsert を呼び出す
      const r = await fetch(`${FRONT}/api/bff/auth/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // BFF と Rails 間の共有トークン（フロントには見せない）
          "X-BFF-Token": process.env.BFF_SHARED_TOKEN ?? "",
        },
        body,
      });

      // upsert に失敗したらログイン自体を拒否
      if (!r.ok) return false;

      // Rails から返された railsUserId（users.id）を受け取る
      const { railsUserId, railsUserName } = (await r.json()) as {
        railsUserId: string | number;
        railsUserName: string | null;
      };

      // OAuth ログインでも userId を Rails users.id に統一する
      appUser.userId = String(railsUserId);
      if (railsUserName?.trim()) appUser.name = railsUserName;

      return true; // ログイン続行
    },

    // jwt コールバック
    // - サインイン時やセッション更新時に JWT の中身を組み立てる
    async jwt({ token, user, session, trigger }) {
      const t = token as AppJWT;

      // サインイン直後（user が存在するタイミング）
      if (user) {
        const u = user as AppUser;

        // Rails users.id を JWT にコピー
        if (u.userId) {
          t.userId = u.userId;
        }
        // name / email も JWT にコピーしておく（後で session に流す）
        if (u.name !== undefined) {
          t.name = u.name;
        }
        if (u.email !== undefined) {
          t.email = u.email;
        }
      }

      // プロフィール更新時など
      // - useSession().update(...) を呼ぶと trigger === "update" でここに来る
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

    // session コールバック
    // - クライアント側の useSession() から見える session オブジェクトを整形
    async session({ session, token }) {
      const t = token as AppJWT;
      const s = session as AppSession;

      // アプリで使う ID は常に userId として扱う
      // - クライアントから Rails API を叩くときなどに利用
      s.userId = t.userId;

      // 既存の session.user があれば保持しつつ上書き
      const currentUser = s.user ?? {};

      s.user = {
        ...currentUser,
        // name / email は JWT 側を優先し、無ければ既存の値を使う
        name: t.name ?? currentUser.name ?? null,
        email: t.email ?? currentUser.email ?? null,
      };

      return s;
    },
  },
} satisfies NextAuthOptions; // authOptions が NextAuthOptions として型安全であることを保証
