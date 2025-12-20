// /src/app/rooms/[id]/RoomChat.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Message = {
  id: number;
  userName: string;
  body: string;
  isMe: boolean;
  createdAt: string;
};

type RoomChatProps = {
  roomId: number;
  roomTitle: string;
  roomTime: string;
  userName: string;
};

const initialMessages: Message[] = [];

const RoomChat = ({ roomId, roomTitle, userName }: RoomChatProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const { data: session } = useSession();

  const listRef = useRef<HTMLDivElement | null>(null);

  const shouldJumpRef = useRef(true);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("scrollToBottomAfterReload") === "1") {
      shouldJumpRef.current = true;
    }
  }, []);

  const jumpToBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    // 投稿時移動（瞬間移動）
    el.scrollTop = el.scrollHeight;
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/bff/messages?roomId=${roomId}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("load messages failed:", data);
      return;
    }

    const myId = session?.userId;

    const list: Message[] = Array.isArray(data)
      ? data.map((m) => ({
          id: m.id,
          userName: m.user?.name ?? "unknown",
          body: m.body,
          isMe: myId ? String(m.user_id) === String(myId) : false,
          createdAt: new Date(m.created_at).toLocaleString("ja-JP"),
        }))
      : [];

    shouldJumpRef.current = true;
    setMessages(list);
  }, [roomId, session?.userId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!shouldJumpRef.current) return;
    if (messages.length === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        jumpToBottom();
        shouldJumpRef.current = false;

        sessionStorage.removeItem("scrollToBottomAfterReload");
      });
    });
  }, [messages.length, jumpToBottom]);

  useEffect(() => {
    // bodyだけだと効かない環境があるので html も付けるのが安全
    document.body.classList.add("no-page-scroll");
    document.documentElement.classList.add("no-page-scroll");

    return () => {
      document.body.classList.remove("no-page-scroll");
      document.documentElement.classList.remove("no-page-scroll");
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v = text.trim();
    if (!v) return;

    setText("");

    const res = await fetch("/api/bff/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, body: v }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      alert(
        data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join("\n") : "送信失敗")
      );
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: data.id,
        userName: data.user?.name ?? "自分",
        body: data.body,
        isMe: true,
        createdAt: new Date(data.created_at).toLocaleString("ja-JP"),
      },
    ]);

    sessionStorage.setItem("scrollToBottomAfterReload", "1");
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* 上部ヘッダー */}
      <header className="h-12 px-3 flex justify-between items-center border-b-2  shadow-sm bg-white ">
        <button
          className="text-cyan-400 text-sm font-semibold mr-3 justify-end"
          onClick={() => router.push("/")}
        >
          〈 戻る
        </button>
        <div className="flex items-center gap-4 text-sm font-semibold text-cyan-400">
          <p>
            ルーム名:{" "}
            <span className="text-slate-800 font-normal">{roomTitle}</span>
          </p>
          <p>
            ルームID:{" "}
            <span className="text-slate-800 font-normal">{roomId}</span>
          </p>
          <p>
            作成者:{" "}
            <span className="text-slate-800 font-normal">{userName}</span>
          </p>
        </div>
      </header>

      {/* メッセージ一覧*/}
      <div
        ref={listRef}
        className="flex-1 min-h-0 px-3 pt-2 pb-[9rem] overflow-y-auto space-y-3 bg-slate-50"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.isMe ? "justify-start" : "justify-end"
            }`}
          >
            <p
              className={`text-[12px] mt-2 pb-0.5 ${
                m.isMe ? "text-cyan-400" : "text-slate-400"
              }`}
            >
              {m.createdAt}
            </p>
            <div
              className={`max-w-[80%] w-fit rounded-2xl px-3 py-2 text-sm shadow-sm bg-cyan-400 ${
                m.isMe ? "text-white rounded-bl-sm" : "text-white rounded-br-sm"
              }`}
            >
              {!m.isMe && (
                <p className="text-[12px] text-cyan-400 mb-0.5">{m.userName}</p>
              )}
              <p className="whitespace-pre-wrap break-words">{m.body}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-xs text-slate-500 text-center mt-8">
            まだメッセージがありません。最初の一言を送ってみましょう。
          </p>
        )}
      </div>

      {/* 下部入力フォーム*/}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-10/12 left-1/2 -translate-x-1/2 h-14 px-3 flex items-center gap-2 border-t border-slate-200 bg-white z-20"
      >
        <input
          suppressHydrationWarning
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
};

export default RoomChat;
