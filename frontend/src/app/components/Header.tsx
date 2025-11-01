"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@headlessui/react";

type Props = { onLoginClick: () => void };

export default function Header({ onLoginClick }: Props) {
  const { status } = useSession(); // "authenticated" | "unauthenticated"
  const [busyOut, setBusyOut] = useState(false);
  const [busyDel, setBusyDel] = useState(false);

  const onLogout = async () => {
    setBusyOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setBusyOut(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("アカウントを削除します。よろしいですか？")) return;
    setBusyDel(true);
    try {
      const r = await fetch("/api/bff/user", { method: "DELETE" }); // Railsで退会処理
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await signOut({ callbackUrl: "/" });
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyDel(false);
    }
  };

  return (
    <header className="w-full h-[70px] flex items-center justify-center bg-white shadow-md relative z-10">
      <div className="flex w-10/12 items-center justify-between h-full mx-9">
        {status === "authenticated" ? (
          <>
            <Button onClick={onLogout} disabled={busyOut}>
              ログアウト
            </Button>
            <Button
              className="text-cyan-400"
              onClick={onDelete}
              disabled={busyDel}
            >
              アカウント削除
            </Button>
          </>
        ) : (
          <Button className={"text-cyan-400 font-sans text-lg font-bold"} onClick={onLoginClick}>ログイン / 新規登録</Button>
        )}
      </div>
    </header>
  );
}
