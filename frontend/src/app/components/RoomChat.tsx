"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toastPopup";

type Message = {
  id: number;
  userName: string;
  body: string;
  isMe: boolean;
  createdAt: string;
  editedAt?: string | null;
};

type RoomChatProps = {
  roomId: number;
  roomTitle: string;
  roomTime: string;
  userName: string;
};

type MenuState = {
  messageId: number;
  x: number;
  y: number;
} | null;

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

const RoomChat = ({ roomId, roomTitle, userName }: RoomChatProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // -----------------------------
  // state / ref
  // -----------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalText, setOriginalText] = useState("");

  const [menu, setMenu] = useState<MenuState>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const shouldJumpRef = useRef(true);

  // -----------------------------
  // derived data
  // -----------------------------
  let selectedMessage: Message | null = null;

  if (menu) {
    selectedMessage =
      messages.find((message) => message.id === menu.messageId) ?? null;
  }

  // -----------------------------
  // ui helper
  // -----------------------------
  const closeMenu = () => {
    setMenu(null);
  };

  const startEdit = (message: Message) => {
    setEditingId(message.id);
    setText(message.body);
    setOriginalText(message.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText("");
    setOriginalText("");
  };

  const openMenu = (event: React.MouseEvent, message: Message) => {
    if (!message.isMe) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) return;

    if (menu?.messageId === message.id) {
      closeMenu();
      return;
    }

    const margin = 8;
    const rawX = event.clientX;
    const rawY = event.clientY - margin;

    const menuX = Math.max(margin, Math.min(rawX, window.innerWidth - margin));
    const menuY = Math.max(margin, Math.min(rawY, window.innerHeight - margin));

    setMenu({
      messageId: message.id,
      x: menuX,
      y: menuY,
    });
  };

  const jumpToBottom = useCallback(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    listElement.scrollTop = listElement.scrollHeight;
  }, []);

  // -----------------------------
  // api
  // -----------------------------
  const loadMessages = useCallback(async () => {
    const response = await fetch(`/api/bff/messages?roomId=${roomId}`, {
      cache: "no-store",
    });

    const responseText = await response.text().catch(() => "");
    let responseData = null;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      const info = {
        status: response.status,
        contentType: response.headers.get("content-type"),
        text: responseText.slice(0, 500),
      };
      console.error("load messages failed:\n" + JSON.stringify(info, null, 2));
      return;
    }

    const myId = session?.userId;

    const messageList: Message[] = Array.isArray(responseData)
      ? responseData.map((message) => ({
          id: message.id,
          userName: message.user?.name ?? "unknown",
          body: message.body,
          isMe: myId ? String(message.user_id) === String(myId) : false,
          createdAt: message.created_at,
          editedAt: message.edited_at ?? null,
        }))
      : [];

    shouldJumpRef.current = true;
    setMessages(messageList);
  }, [roomId, session?.userId]);

  const deleteMessage = async (message: Message) => {
    if (busy) return;

    setBusy(true);

    try {
      const response = await fetch(
        `/api/bff/messages/${message.id}?roomId=${roomId}`,
        {
          method: "DELETE",
          cache: "no-store",
        },
      );

      if (response.status === 204 || response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((prevMessage) => prevMessage.id !== message.id),
        );
        toast.success("削除に成功しました");
        router.refresh();
        return;
      }

      const responseData = await response.json().catch(() => null);
      toast.error(responseData?.error ?? "削除に失敗しました");
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  const updateMessage = async (trimmedText: string) => {
    if (editingId === null) return;

    if (trimmedText === originalText.trim()) {
      cancelEdit();
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(
        `/api/bff/messages/${editingId}?roomId=${roomId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ body: trimmedText }),
        },
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (responseData?.error === "edit_window_expired") {
          toast.error(
            "このメッセージは送信から1時間を超えたため編集できません。",
          );
        } else {
          toast.error(responseData?.error ?? "編集に失敗しました");
        }
        return;
      }

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === editingId
            ? {
                ...message,
                body: responseData.body ?? trimmedText,
                editedAt: responseData.edited_at ?? new Date().toISOString(),
              }
            : message,
        ),
      );

      cancelEdit();
      toast.success("編集しました");
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  const createMessage = async (trimmedText: string) => {
    setBusy(true);

    try {
      const response = await fetch(`/api/bff/messages?roomId=${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, body: trimmedText }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(
          responseData?.error ||
            (Array.isArray(responseData?.errors)
              ? responseData.errors.join("\n")
              : "送信に失敗しました"),
        );
        return;
      }

      setText("");

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: responseData.id,
          userName: responseData.user?.name ?? "自分",
          body: responseData.body,
          isMe: true,
          createdAt: responseData.created_at,
          editedAt: responseData.edited_at ?? null,
        },
      ]);

      sessionStorage.setItem("scrollToBottomAfterReload", "1");
      await loadMessages();
      shouldJumpRef.current = true;
      toast.success("送信しました");
    } catch (error) {
      console.error(error);
      toast.error("通信エラーが発生しました");
    } finally {
      setBusy(false);
    }
  };

  // -----------------------------
  // submit
  // -----------------------------
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText || busy) return;

    if (editingId !== null) {
      await updateMessage(trimmedText);
      return;
    }

    await createMessage(trimmedText);
  };

  // -----------------------------
  // effects
  // -----------------------------
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("scrollToBottomAfterReload") === "1") {
      shouldJumpRef.current = true;
    }
  }, []);

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

  // -----------------------------
  // render
  // -----------------------------
  return (
    <div
      className="flex flex-col h-[100dvh] overflow-hidden"
      suppressHydrationWarning
    >
      <header className="h-12 px-3 flex justify-end items-center border-b-2 shadow-sm bg-white">
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

          <div className="shrink-0 whitespace-nowrap md:text-base sm:text-sm text-xs">
            作成者:{" "}
            <span className="text-slate-800 font-normal md:text-base sm:text-sm text-xs">
              {userName}
            </span>
          </div>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 min-h-0 px-3 pt-2 pb-[9rem] overflow-y-auto space-y-3 bg-slate-50"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-full flex flex-col ${
              message.isMe ? "items-start" : "items-end"
            }`}
          >
            {!message.isMe && (
              <p className="text-[9px] sm:text-sm text-cyan-400">
                ユーザー
                <span className="text-[9px] sm:text-sm text-slate-400">:</span>
                {message.userName}
              </p>
            )}

            <p
              className={`text-[9px] sm:text-sm pb-0.5 ${
                message.isMe ? "text-cyan-400 mt-2" : "text-slate-400"
              }`}
            >
              {formatJst(message.createdAt)}
              {message.editedAt && (
                <span className="ml-2 md:text-[11px] sm:text-[9px] text-[7px] text-slate-500">
                  (編集済)
                </span>
              )}
            </p>

            <div
              className={`max-w-[80%] w-fit rounded-2xl px-3 py-2 text-xm shadow-sm bg-cyan-400 ${
                message.isMe
                  ? "text-white rounded-bl-sm cursor-pointer"
                  : "text-white rounded-br-sm"
              }`}
              onClick={(event) => openMenu(event, message)}
            >
              <p className="whitespace-pre-wrap break-words md:text-base sm:text-sm text-xs">
                {message.body}
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

      {editingId !== null && (
        <div className="fixed bottom-14 lg:w-11/12 w-full left-1/2 -translate-x-1/2 px-3 z-20">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-t-2xl border border-slate-200 border-b-0 bg-amber-50 px-4 py-2 text-sm text-amber-700 shadow-sm">
              編集中です
            </div>
            <div className="shrink-0 w-[48px]" />
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 lg:w-11/12 w-full left-1/2 -translate-x-1/2 h-14 px-3 flex items-center gap-2 border-t border-slate-200 bg-white z-20"
      >
        <input
          suppressHydrationWarning
          type="text"
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
          placeholder={
            editingId !== null ? "メッセージを編集..." : "メッセージを送信..."
          }
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button
          type="submit"
          className="text-sm font-semibold text-cyan-400 disabled:opacity-40"
          disabled={!text.trim() || busy}
        >
          {editingId !== null ? "保存" : "送信"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="text-sm font-semibold text-slate-500"
            onClick={cancelEdit}
          >
            キャンセル
          </button>
        )}
      </form>

      {menu && selectedMessage && (
        <>
          <div className="fixed inset-0 z-40 bg-black/5" onClick={closeMenu} />

          <div
            className="fixed z-50 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            style={{
              left: menu.x,
              top: menu.y,
              transform: "translate(-50%, -100%)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                closeMenu();
                startEdit(selectedMessage);
              }}
            >
              編集
            </button>

            <button
              type="button"
              className="block w-full border-t border-slate-100 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              onClick={() => {
                closeMenu();
                deleteMessage(selectedMessage);
              }}
            >
              削除
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomChat;
