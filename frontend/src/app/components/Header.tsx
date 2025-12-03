/* eslint-disable @typescript-eslint/no-explicit-any */
/* /src/app/components/Header.tsx */
"use client";

import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";

type Props = {
  onLoginClick: () => void;
};

export default function Header({ onLoginClick }: Props) {
  const route = useRouter();
  const { data: session, status } = useSession();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  if (typeof window !== "undefined") {
    (window as any)._debugSession = session;
    (window as any)._debugStatus = status;
  }

  const handlePostClick = () => {
    if (status !== "authenticated") {
      onLoginClick();
      return;
    }
    setIsPostOpen(true);
  };

  // ★ 投稿処理を async にする
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postTitle.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    try {
      // 投稿APIを叩いてルーム作成（BFF経由）
      const res = await fetch("/api/bff/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: postTitle }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(
          data?.error
            ? `投稿に失敗しました: ${data.error}`
            : "投稿に失敗しました"
        );
        return;
      }

      // 必要なら作成された room の id を受け取る
      // const room = await res.json();

      // 入力クリア & モーダル閉じる
      setPostTitle("");
      setIsPostOpen(false);

      // ★ ホームにリダイレクト
      route.push("/");
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  };

  if (status === "loading") {
    return (
      <header className="w-full h-[70px] flex items-center justify-center bg-white shadow-md relative z-10" />
    );
  }

  return (
    <>
      <header className="w-full h-[70px] flex items-center justify-center bg-white shadow-md relative z-10">
        <div className="flex w-10/12 items-center justify-between h-full mx-9">
          <Button
            className="text-cyan-400 font-sans text-lg font-bold"
            onClick={() => {
              route.push("/");
            }}
          >
            ホーム
          </Button>

          {/* 投稿ボタン → モーダルオープン */}
          <Button
            className="text-cyan-400 font-sans text-lg font-bold"
            onClick={handlePostClick}
          >
            投稿する
          </Button>

          {status === "authenticated" ? (
            <Button
              className="text-cyan-400 font-semibold"
              onClick={() => {
                route.push("/profile");
              }}
            >
              {session?.user?.name ?? "プロフィール"}
            </Button>
          ) : (
            <Button
              className={"text-cyan-400 font-sans text-lg font-bold"}
              onClick={onLoginClick}
            >
              ログイン / 新規登録
            </Button>
          )}
        </div>
      </header>

      {/* 投稿タイトル入力用モーダル */}
      <Transition appear show={isPostOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setIsPostOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-semibold text-cyan-400 mb-4">
                  新規投稿
                </Dialog.Title>

                <form className="space-y-4" onSubmit={handlePostSubmit}>
                  <div>
                    <label
                      htmlFor="post-title"
                      className="block text-sm font-semibold text-cyan-400 mb-1"
                    >
                      タイトル
                    </label>
                    <input
                      id="post-title"
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 bg-slate-50"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="いまどうしてる？"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700"
                      onClick={() => setIsPostOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
                    >
                      投稿する
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
