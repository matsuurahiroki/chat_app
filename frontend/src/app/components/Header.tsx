/* eslint-disable @typescript-eslint/no-explicit-any */
/* /Users/hiro/Desktop/webapp/chatapp/frontend/src/app/components/card.tsx */
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
type Props = {
  onLoginClick: () => void;
};

export default function Header({ onLoginClick }: Props) {
  const route = useRouter();
  const { data: session, status } = useSession();

  if (typeof window !== "undefined") {
    (window as any)._debugSession = session;
    (window as any)._debugStatus = status;
  }

  const goProfile = () => {
    route.push("/profile");
  };

  if (status === "loading") {
    return (
      <header className="w-full h-[70px] flex items-center justify-center bg-white shadow-md relative z-10" />
    );
  }

  return (
    <header className="w-full h-[70px] flex items-center justify-center bg-white shadow-md relative z-10">
      <div className="flex w-10/12 items-center justify-between h-full mx-9">
        <Button
          className="text-cyan-400 font-sans text-lg font-bold"
          onClick={() => {
            route.push("/");
          }}
        >
          ホーム
        </Button>
        <Button
        className="text-cyan-400 font-sans text-lg font-bold"
        onClick={() => {}}
        >投稿する</Button>
        {status === "authenticated" ? (
          <>
            <Button className="text-cyan-400 font-semibold" onClick={goProfile}>
              {session?.user?.name ?? "プロフィール"}
            </Button>
          </>
        ) : (
          <Button
            className={"text-cyan-400 font-sans text-lg font-bold"}
            onClick={onLoginClick}
          >
            ログイン / 新規登録
          </Button>
        )}
      </div>
    </header>
  );
}
