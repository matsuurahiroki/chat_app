// app/components/RoomChat.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  userName: string;
  body: string;
  isMe: boolean;
  createdAt: string;
  editedAt?: string | null;
};

// Messageらのプロパティの要素名はRails側のJSONに合わせている(今回の場合はカラム名から抽出)

type RoomChatProps = {
  roomId: number;
  roomTitle: string;
  roomTime: string;
  userName: string;
};

type MenuState = { messageId: number; x: number; y: number } | null;

const fmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const formatJst = (iso: string) => fmt.format(new Date(iso));

const initialMessages: Message[] = [];

const RoomChat = ({ roomId, roomTitle, userName }: RoomChatProps) => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const shouldJumpRef = useRef(true);
  const [menu, setMenu] = useState<MenuState>(null);
  const selectedMessage = menu
    ? messages.find((mm) => mm.id === menu.messageId)
    : null;
  const closeMenu = () => setMenu(null);
  const startEdit = (m: Message) => {
    setEditingId(m.id);
    setText(m.body); // 下の入力欄に本文を入れて編集させる
  };
  const openMenu = (e: React.MouseEvent, m: Message) => {
    if (!m.isMe) return;

    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) return;

    // 同じメッセージを再クリックで閉じる
    if (menu?.messageId === m.id) {
      setMenu(null);
      return;
    }

    const margin = 8;
    const x0 = e.clientX;
    const y0 = e.clientY - margin;

    const x = Math.max(margin, Math.min(x0, window.innerWidth - margin));
    const y = Math.max(margin, Math.min(y0, window.innerHeight - margin));

    setMenu({ messageId: m.id, x, y });
  };

  const deleteMessage = async (m: Message) => {
    if (busy) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/bff/messages/${m.id}?roomId=${roomId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      // 204 No Content でも成功扱いにする
      if (res.status === 204 || res.ok) {
        setMessages((prev) => prev.filter((r) => r.id !== m.id));
        alert("削除に成功しました");
        router.refresh();
        return;
      }

      const data = await res.json().catch(() => null);
      alert(data?.error ?? "削除に失敗しました");
    } finally {
      setBusy(false);
    }
  };

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
    // 投稿時移動
    el.scrollTop = el.scrollHeight;
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/bff/messages?roomId=${roomId}`, {
      cache: "no-store",
    });
    const text = await res.text().catch(() => "");
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const info = {
        status: res.status,
        contentType: res.headers.get("content-type"),
        text: text.slice(0, 500),
      };
      console.error("load messages failed:\n" + JSON.stringify(info, null, 2));
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
          editedAt: m.edited_at ?? null,
        }))
      : [];

    shouldJumpRef.current = true;
    setMessages(list);
  }, [roomId, session?.userId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadMessages();
  }, [status, loadMessages]);

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
    if (editingId !== null) {
      setBusy(true);
      try {
        const res = await fetch(
          `/api/bff/messages/${editingId}?roomId=${roomId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({ body: v }),
          }
        );

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          if (data?.error === "edit_window_expired") {
            alert("このメッセージは送信から1時間を超えたため編集できません。");
          } else {
            alert(data?.error ?? "編集に失敗しました");
          }
          return;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === editingId
              ? {
                  ...m,
                  body: data.body ?? v,
                  editedAt: data.edited_at ?? new Date().toISOString(),
                }
              : m
          )
        );

        setEditingId(null);
        return;
      } finally {
        setBusy(false);
      }
    }

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
    await loadMessages();
    shouldJumpRef.current = true;
  };

  return (
    <div
      className="flex flex-col h-[100dvh] overflow-hidden"
      suppressHydrationWarning
    >
      {/* 上部ヘッダー */}
      <header className="h-12 px-3 flex justify-end items-center border-b-2  shadow-sm bg-white ">
        <div className="flex justify-end min-w-0 items-center gap-4 text-sm font-semibold text-cyan-400">
          <div className="flex min-w-0 items-center gap-1 max-w-[50%]">
            <span className="shrink-0 sm:text-sm text-xs">ルーム名:</span>
            <span className="min-w-0 truncate inline-block text-slate-800 font-normal sm:text-sm text-xs">
              {roomTitle}
            </span>
          </div>
          <div className="shrink-0 whitespace-nowrap sm:text-sm text-xs">
            ルームID:{" "}
            <span className="text-slate-800 font-normal sm:text-sm text-xs">
              {roomId}
            </span>
          </div>

          {/* 作成者：縮まない（位置固定） */}
          <div className="shrink-0 whitespace-nowrap md:text-base sm:text-sm text-xs">
            作成者:{" "}
            <span className="text-slate-800 font-normal md:text-base sm:text-sm text-xs">
              {userName}
            </span>
          </div>
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
              className={`text-[9px] sm:text-sm mt-2 pb-0.5 ${
                m.isMe ? "text-cyan-400" : "text-slate-400"
              }`}
            >
              {formatJst(m.createdAt)}
              {m.editedAt && (
                <span className="ml-2 md:text-[11px] sm:text-
              [9px] text-[7px] text-slate-500">
                  (編集済)
                </span>
              )}
            </p>
            <div
              className={`max-w-[80%] w-fit rounded-2xl px-3 py-2 text-xm shadow-sm bg-cyan-400 ${
                m.isMe
                  ? "text-white rounded-bl-sm cursor-pointer"
                  : "text-white rounded-br-sm"
              }`}
              onClick={(e) => openMenu(e, m)}
            >
              {!m.isMe && (
                <p className="md:text-base sm:text-sm text-xs text-cyan-400 mb-0.5">
                  {m.userName}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words md:text-base sm:text-sm text-xs">
                {m.body}
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

      {/* 下部入力フォーム*/}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 lg:w-11/12 w-full left-1/2 -translate-x-1/2 h-14 px-3 flex items-center gap-2 border-t border-slate-200 bg-white z-20"
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
      {menu && selectedMessage && (
        <>
          {/* メニュー外クリックで閉じる */}
          <div className="fixed inset-0 z-40" onClick={closeMenu} />

          {/* メニュー本体 */}
          <div
            className="fixed z-50 rounded-full border bg-white shadow px-3 py-1 text-sm"
            style={{
              left: menu.x,
              top: menu.y,
              transform: "translate(-50%, -100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="whitespace-nowrap hover:opacity-80"
                onClick={() => {
                  closeMenu();
                  startEdit(selectedMessage);
                }}
              >
                編集
              </button>

              <button
                type="button"
                className="whitespace-nowrap hover:opacity-80 text-red-600"
                onClick={() => {
                  closeMenu();
                  deleteMessage(selectedMessage);
                }}
              >
                削除
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomChat;
