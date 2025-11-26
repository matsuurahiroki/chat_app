// src/app/profile/AuthPasswordPanel.tsx
"use client";

import { useState } from "react";

export function AuthPassword() {
  const [currentPassword, setCurrentPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    try {
      if (newPassword !== newPasswordConfirm) {
        alert("新しいパスワードが確認用と一致していません");
        return;
      }

      // TODO: 後で /api/bff/auth/password などへ接続する
      // const res = await fetch("/api/bff/auth/password", { ... });

      alert("パスワード変更APIはまだ未実装です（UIだけ）");
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 現在のパスワード */}
        <div>
          <label
            htmlFor="current-password"
            className="block text-sm font-semibold text-cyan-400 mb-1"
          >
            現在のパスワード
          </label>
          <input
            id="current-password"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        {/* 新しいパスワード */}
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-semibold text-cyan-400 mb-1"
          >
            新しいパスワード
          </label>
          <input
            id="new-password"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* 新しいパスワード（確認） */}
        <div>
          <label
            htmlFor="new-password-confirm"
            className="block text-sm font-semibold text-cyan-400 mb-1"
          >
            新しいパスワード（確認）
          </label>
          <input
            id="new-password-confirm"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
          />
        </div>

        {/* ボタン */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={busy}
            className="w-full md:w-48 rounded-lg bg-cyan-400 text-white text-sm font-semibold py-2 hover:bg-cyan-600 disabled:opacity-60"
          >
            {busy ? "変更中..." : "パスワードを変更（ダミー）"}
          </button>
          <p className="mt-2 text-xs text-slate-400">
            実際のパスワード変更処理は、後で Rails / BFF API
            を実装してから有効にします。
          </p>
        </div>
      </form>
    </div>
  );
}
