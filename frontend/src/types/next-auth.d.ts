import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    provider?: string;
    userId?: string;
  }

  interface User {
    id?: string;
    userId?: string;
    railsAccess?: string;
    railsAccessExp?: string;
    railsRefresh?: string;
    railsAccessExp?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
    userId?: string;
  }
}

export {};
