// src/app/components/LogoutTab.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "@/lib/toastPopup";

const LogoutTab = () => {
  const [busy_l, setBusy_l] = useState(false);
    const [busy_s, setBusy_s] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy_l) return;

    setBusy_l(true);
    setMsg(null);

    try {
      await fetch("/api/bff/auth/logout", { method: "DELETE" }).catch(
        () => null,
      );

      // Cookie削除
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      setMsg("ログアウトに失敗しました。もう一度お試しください。");
      toast.error("ログアウトに失敗しました。もう一度お試しください。");
      setBusy_l(false);
    }
  };
  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy_l) return;

    setBusy_l(true);
    setMsg(null);

    try {
      await fetch("/api/bff/auth/logout", { method: "DELETE" }).catch(
        () => null,
      );

      // Cookie削除
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      setMsg("ログアウトに失敗しました。もう一度お試しください。");
      toast.error("ログアウトに失敗しました。もう一度お試しください。");
      setBusy_s(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="mt-2">
        <p className="font-semibold text-cyan-400 mb-3 text-base sm:text-lg">ログアウト</p>
        <p className="text-slate-700 text-sm sm:text-base">
          ログアウトすると、再度ログインが必要になります。
        </p>

        {msg && <p className="mt-3 text-sm text-red-500">{msg}</p>}

        <form className="mt-6" onSubmit={handleLogout}>
          <button
            type="submit"
            disabled={busy_l}
            className={
              "w-full md:w-40 rounded-lg text-white text-sm sm:text-base font-semibold py-2 " +
              (busy_l ? "bg-slate-300" : "bg-red-500 hover:bg-red-600")
            }
          >
            {busy_l ? "処理中..." : "ログアウト"}
          </button>
        </form>
      </div>
      <div className="mt-20">
        <p className="font-semibold text-cyan-400  mb-3 text-base sm:text-lg">アカウント削除</p>
        <p className="text-slate-700 text-sm sm:text-base">
          アカウントを削除すると二度とこのアカウントが使用できなくなります
        </p>

        {msg && <p className="mt-3 text-sm text-red-500">{msg}</p>}
        <form className="mt-5" onSubmit={handleSignOut}>
          <button
            type="submit"
            disabled={busy_s}
            className={
              "w-full md:w-40 rounded-lg text-white text-sm sm:text-base font-semibold py-2 " +
              (busy_s ? "bg-slate-300" : "bg-red-500 hover:bg-red-600")
            }
          >
            {busy_s ? "処理中..." : "アカウント削除"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogoutTab;
