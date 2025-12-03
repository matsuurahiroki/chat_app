// /src/app/rooms/[id]/RoomChat.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  userName: string;
  body: string;
  isMe: boolean;
  createdAt: string;
};

type Props = {
  roomId: number;
};

const initialMessages: Message[] = [
  {
    id: 1,
    userName: "ひろ",
    body: "ひまあああああああ",
    isMe: false,
    createdAt: "23:40",
  },
  {
    id: 2,
    userName: "自分",
    body: "わかる",
    isMe: true,
    createdAt: "23:41",
  },
];

export function RoomChat({ roomId }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // とりあえずローカルで追加（あとでAPIに差し替え）
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        userName: "自分",
        body: text.trim(),
        isMe: true,
        createdAt: new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setText("");

    // TODO: ここで /api/bff/messages に POST してRailsへ送る
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 上部ヘッダー（インスタDMっぽく） */}
      <header className="h-12 px-3 flex items-center border-b border-slate-200">
        <button
          className="text-cyan-400 text-sm font-semibold mr-3"
          onClick={() => router.push("/")}
        >
          〈 戻る
        </button>
        <h1 className="text-sm font-semibold text-slate-800">
          ルーム #{roomId}
        </h1>
      </header>

      {/* メッセージ一覧（スクロール領域） */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                m.isMe
                  ? "bg-cyan-400 text-white rounded-br-sm"
                  : "bg-white text-slate-900 rounded-bl-sm"
              }`}
            >
              {!m.isMe && (
                <p className="text-[10px] text-slate-500 mb-0.5">
                  {m.userName}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words">{m.body}</p>
              <p
                className={`text-[10px] mt-1 ${
                  m.isMe ? "text-cyan-100" : "text-slate-400"
                }`}
              >
                {m.createdAt}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-xs text-slate-500 text-center mt-8">
            まだメッセージがありません。最初の一言を送ってみましょう。
          </p>
        )}
      </div>

      {/* 下部入力フォーム（インスタの入力欄風） */}
      <form
        onSubmit={handleSubmit}
        className="h-14 px-3 flex items-center gap-2 border-t border-slate-200 bg-white"
      >
        <input
          type="text"
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          placeholder="メッセージを送信..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="text-sm font-semibold text-cyan-400 disabled:opacity-40"
          disabled={!text.trim()}
        >
          送信
        </button>
      </form>
    </div>
  );
}
