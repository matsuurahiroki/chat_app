// src/app/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type Props = {
  initialName: string;
  initialEmail: string;
  userId: string;
};

export function ProfileForm({ initialName, initialEmail, userId }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (busy) return; // ① ここで判定
    setBusy(true); // ② false のときだけ true にして送信開始
    // ③ ここから下が「送信処理」
    // fetch("/api/bff/profile", ...) など
    try {
      const res = await fetch("/api/bff/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          data?.error
            ? `更新に失敗しました: ${data.error}`
            : "更新に失敗しました"
        );
        return;
      }

      // ★ NextAuth のセッション更新時のやつ
      await update({ name, email });

      alert("プロフィールを更新しました");
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    } finally {
      setBusy(false); // ④ 最後に必ず false に戻す (finallyは成功失敗関係なく実行される)
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 "
      suppressHydrationWarning
    >
      {/* アイコン＋ユーザーID */}
      <div className="flex flex-col ">
        <p className="font-semibold text-cyan-400">
          ユーザーID{" "}
          <span className=" font-mono font-normal text-slate-800">
            {userId}
          </span>
        </p>
      </div>

      {/* フォーム本体 */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* ユーザー名 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-cyan-400  mb-1"
          >
            ユーザー名
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400  bg-slate-50"
            value={name}
            onChange={(e) => setName(e.target.value)} // ← ここで編集を反映
            suppressHydrationWarning
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-cyan-400 mb-1"
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            suppressHydrationWarning
          />
        </div>

        {/* 更新ボタン */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-40 rounded-lg bg-cyan-400 text-white text-sm font-semibold py-2 hover:bg-cyan-600"
            disabled={busy}
          >
            {busy ? "更新中..." : "更新"}
          </button>
        </div>
      </form>
    </div>
  );
}
