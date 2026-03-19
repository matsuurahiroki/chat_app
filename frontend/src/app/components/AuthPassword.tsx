"use client";

import { toast } from "@/lib/toastPopup";
import { useState } from "react";

const AuthPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    if (!currentPassword.trim()) {
      toast.error("現在のパスワードを入力してください");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("新しいパスワードを入力してください");
      return;
    }

    if (!newPasswordConfirm.trim()) {
      toast.error("確認用の新しいパスワードを入力してください");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      toast.error("新しいパスワードが確認用と一致していません");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("現在のパスワードとは別の新しいパスワードを入力してください");
      return;
    }

    setBusy(true);

    try {
      // TODO: 後で /api/bff/auth/password などへ接続する
      const response = await fetch("/api/bff/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: newPasswordConfirm,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(responseData?.error ?? "パスワードの変更に失敗しました");
        return;
      }

      toast.success("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="current-password"
            className="block sm:text-sm text-xs font-semibold text-cyan-400 mb-1"
          >
            現在のパスワード
          </label>
          <input
            id="current-password"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 sm:text-sm text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="new-password"
            className="block sm:text-sm text-xs font-semibold text-cyan-400 mb-1"
          >
            新しいパスワード
          </label>
          <input
            id="new-password"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 sm:text-sm text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="new-password-confirm"
            className="block sm:text-sm text-xs font-semibold text-cyan-400 mb-1"
          >
            新しいパスワード（確認）
          </label>
          <input
            id="new-password-confirm"
            type="password"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 sm:text-sm text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
            value={newPasswordConfirm}
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={
              busy ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !newPasswordConfirm.trim()
            }
            className="w-full md:w-48 rounded-lg bg-cyan-400 text-white text-sm sm:text-base font-semibold py-2 hover:bg-cyan-600 disabled:opacity-60"
          >
            {busy ? "変更中..." : "パスワードを変更"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPassword;
