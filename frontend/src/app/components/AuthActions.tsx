"use client";

import { useState } from "react";
import { Button, Group } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";

export default function AuthActions() {
  const { status } = useSession();            // "authenticated" のときだけ表示
  const [busyDel, setBusyDel] = useState(false);
  const [busyOut, setBusyOut] = useState(false);

  if (status !== "authenticated") return null;

  const onDelete = async () => {
    if (!confirm("本当にアカウントを削除しますか？この操作は元に戻せません。")) return;
    setBusyDel(true);
    try {
      const r = await fetch("/api/bff/user", { method: "DELETE" }); // BFF → Railsへ中継
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      await signOut({ callbackUrl: "/" }); // 削除後はログアウト
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setBusyDel(false);
    }
  };

  const onLogout = async () => {
    setBusyOut(true);
    try {
      await fetch("/api/bff/auth/logout", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } finally {
      setBusyOut(false);
    }
  };

  return (
    <Group>
      <Button variant="default" onClick={onLogout} loading={busyOut}>ログアウト</Button>
      <Button color="red" onClick={onDelete} loading={busyDel}>アカウント削除</Button>
    </Group>
  );
}
