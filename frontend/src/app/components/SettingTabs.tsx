// /src/app/components/SettingTabs.tsx
"use client";

import { useState } from "react";
import { ProfileForm } from "./ProfileForm";
import { AuthPassword } from "../components/AuthPassword";

type Props = {
  initialName: string;
  initialEmail: string;
  userId: string;
};

export function SettingTabs({ initialName, initialEmail, userId, }: Props) {
  const [tab, setTab] = useState<"profile" | "auth">("profile");

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
          </nav>
        </div>
      </aside>

      {/* 右側メインコンテンツ */}
      <section className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-cyan-400 mb-6">
            {tab === "profile" ? "プロフィール" : "認証とパスワード"}
          </h1>

          {tab === "profile" && (
            <ProfileForm
              initialName={initialName}
              initialEmail={initialEmail}
              userId={userId}
            />
          )}

          {tab === "auth" && <AuthPassword />}
        </div>
      </section>
    </main>
  );
}
