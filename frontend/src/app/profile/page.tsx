"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  id: number;
  name: string;
  email: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch("/api/bff/profile")
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  if (!profile) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 min-h-screen">
      {/* 上部バナー */}
      <div className="w-full h-48 bg-gradient-to-r from-green-400 to-emerald-500 flex justify-center items-end pb-10">
      </div>

      <div className="w-full max-w-2xl p-6">
        {/* 名前 */}
        <h1 className="text-3xl font-bold text-center mt-4">{profile.name}</h1>

        {/* メール */}
        <p className="text-center text-gray-600">{profile.email}</p>

        {/* 自己紹介カード */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">自己紹介</h2>
          <p className="text-gray-700">
            こんにちは！{profile.name} です。 現在、Webアプリ開発（Next.js /
            Rails）を勉強しています！
          </p>

          <a
            href="/profile/edit"
            className="text-cyan-500 font-semibold underline block mt-4"
          >
            プロフィールを編集する →
          </a>
        </div>

        {/* 学習中のコース */}
        <h2 className="text-xl font-semibold mt-8 mb-3">学習中のコース</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-bold">Next.js 入門</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div className="bg-green-500 h-3 rounded-full w-[60%]"></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">60% 完了</p>
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-bold">Rails API 基礎</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div className="bg-green-500 h-3 rounded-full w-[35%]"></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">35% 完了</p>
          </div>
        </div>

        {/* バッジ一覧 */}
        <h2 className="text-xl font-semibold mt-8 mb-3">バッジ</h2>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-yellow-300 rounded-full shadow flex items-center justify-center font-bold">
            ⭐️
          </div>
          <div className="w-16 h-16 bg-blue-300 rounded-full shadow flex items-center justify-center font-bold">
            🔥
          </div>
          <div className="w-16 h-16 bg-purple-300 rounded-full shadow flex items-center justify-center font-bold">
            🎉
          </div>
        </div>
      </div>
    </div>
  );
}
