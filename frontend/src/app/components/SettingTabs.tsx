// /src/app/components/SettingTabs.tsx
"use client";

import { useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { AuthPassword } from "../components/AuthPassword";
import DeleteTab from "./DeleteTab";

type Props = {
  initialName: string;
  initialEmail: string;
  userId: string;
};

export function SettingTabs({ initialName, initialEmail, userId }: Props) {
  const [tab, setTab] = useState<"profile" | "auth" | "delete">("profile");

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* 左サイドメニュー */}
      <aside className="hidden md:block w-64 bg-white shadow-sm border-r border-slate-100">
        <div className="px-6 py-6">
          <h2 className="text-sm font-semibold text-slate-500 mb-4">設定</h2>
          <nav className="space-y-1 text-sm">
            <button
              type="button"
              onClick={() => setTab("profile")}
              className={
                "w-full text-left rounded-lg px-3 py-2 " +
                (tab === "profile"
                  ? "bg-cyan-50 text-cyan-400 font-semibold"
                  : "text-slate-600 hover:bg-slate-50")
              }
            >
              プロフィール
            </button>

            <button
              type="button"
              onClick={() => setTab("auth")}
              className={
                "w-full text-left rounded-lg px-3 py-2 " +
                (tab === "auth"
                  ? "bg-cyan-50 text-cyan-400 font-semibold"
                  : "text-slate-600 hover:bg-slate-50")
              }
            >
              認証とパスワード
            </button>

            <button
              type="button"
              onClick={() => setTab("delete")}
              className={
                "w-full text-left rounded-lg px-3 py-2 " +
                (tab === "delete"
                  ? "bg-cyan-50 text-cyan-400 font-semibold"
                  : "text-slate-600 hover:bg-slate-50")
              }
            >
              ログアウトとアカウント削除
            </button>
          </nav>
        </div>
      </aside>

      {/* 右側メインコンテンツ */}
      <section className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-cyan-400 mb-6">
            {tab === "profile" ? "プロフィール" : tab === "auth" ? "認証とパスワード" : "ログアウトとアカウント削除"}
          </h1>

          {tab === "profile" && (
            <ProfileForm
              initialName={initialName}
              initialEmail={initialEmail}
              userId={userId}
            />
          )}

          {tab === "auth" && <AuthPassword />}

          {tab === "delete" && <DeleteTab />}
        </div>
      </section>
    </main>
  );
}
