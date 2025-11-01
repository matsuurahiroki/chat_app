"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";

export default function AppClientShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"

  // 認証済みになったらモーダルを自動で閉じる
  useEffect(() => {
    if (status === "authenticated") setOpen(false);
  }, [status]);

  return (
    <>
      <Header onLoginClick={() => status !== "authenticated" && setOpen(true)} />
      {status !== "authenticated" && (
        <LoginModal opened={open} onClose={() => setOpen(false)} />
      )}
      {children}
    </>
  );
}
