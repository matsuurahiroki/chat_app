// src/app/components/LogoutTab.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

const LogoutTab = () => {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setMsg(null);

    try {
      await fetch("/api/bff/auth/logout", { method: "DELETE" }).catch(
        () => null
      );

      // Cookie削除
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      setMsg("ログアウトに失敗しました。もう一度お試しください。");
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div className="mt-2">
        <p className="text-slate-700 text-sm sm:text-base">
          ログアウトすると、再度ログインが必要になります。
        </p>

        {msg && <p className="mt-3 text-sm text-red-500">{msg}</p>}

        <form className="mt-6" onSubmit={handleLogout}>
          <button
            type="submit"
            disabled={busy}
            className={
              "w-full md:w-40 rounded-lg text-white text-sm sm:text-base font-semibold py-2 " +
              (busy ? "bg-slate-300" : "bg-red-500 hover:bg-red-600")
            }
          >
            {busy ? "処理中..." : "ログアウト"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogoutTab;
