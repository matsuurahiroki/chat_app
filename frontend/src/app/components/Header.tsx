/* eslint-disable @typescript-eslint/no-explicit-any */
/* /src/app/components/Header.tsx */
"use client";

import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Dialog, Transition } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  onLoginClick: () => void;
};

export default function Header({ onLoginClick }: Props) {
  const route = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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

    if (isPosting) return; // 多重投稿防止
    if (!postTitle.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    setIsPosting(true);
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
      setIsPosting(false);

      route.push("/");
    } catch (err) {
      console.error(err);
      alert("通信エラーが発生しました");
    }
  };

  if (status === "loading") {
    return (
      <header className="w-full md:h-[70px] h-[50px] flex items-center justify-center bg-white shadow-md fixed z-10 " />
    );
  }

  const handleLoginClick = () => {
    // ホーム以外なら / に移動
    if (pathname !== "/") {
      route.push("/");
      onLoginClick();
    } else {
      onLoginClick();
    }
  };
  // ログインモーダルを開く

  return (
    <>
      <header className="w-full md:h-[70px] h-[50px] flex items-center justify-center bg-white shadow-md  z-10 fixed">
        <div className="flex w-10/12 items-center justify-between h-full mx-9">
          <Button
            className="text-cyan-400 font-sans font-bold md:text-base sm:text-sm text-xs whitespace-nowrap"
            onClick={() => route.push("/")}
          >
            ホーム
          </Button>

          {/* PC用（sm以上） */}
          <nav className="hidden sm:flex items-center gap-6">
            <Button
              type="button"
              className="text-left rounded-lg px-3 py-4 mr-10 md:text-base sm:text-sm text-xs  text-cyan-400 font-semibold hover:bg-slate-100"
              onClick={() => {
                setIsMenuOpen(false);
                handlePostClick();
              }}
            >
              投稿する
            </Button>
            {status === "authenticated" ? (
              <Button
                className="text-cyan-400 font-semibold md:text-base sm:text-sm text-xs whitespace-nowrap"
                onClick={() => route.push("/profile")}
              >
                {session?.user?.name ?? "プロフィール"}
              </Button>
            ) : (
              <Button
                className="text-cyan-400 font-sans md:text-base sm:text-sm text-xs font-bold whitespace-nowrap"
                onClick={handleLoginClick}
              >
                ログイン / 新規登録
              </Button>
            )}
          </nav>

          {/* スマホ用（sm未満） */}
          <button
            type="button"
            className="sm:hidden shrink-0 py-2 text-cyan-400 font-bold text-2xl"
            aria-label="メニューを開く"
            onClick={() => setIsMenuOpen(true)}
          >
            ≡
          </button>
        </div>
      </header>

      <Transition appear show={isMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setIsMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-4"
            >
              <Dialog.Panel className="h-full w-[75%] max-w-xs bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-cyan-400 font-semibold !text-md">
                    メニュー
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-cyan-400 font-bold px-2 py-1 block text-2xl"
                    aria-label="閉じる"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="text-left rounded-lg px-3 py-2 !text-sm text-cyan-400 font-semibold hover:bg-slate-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      route.push("/");
                    }}
                  >
                    ホーム
                  </button>

                  <button
                    type="button"
                    className="text-left rounded-lg px-3 py-2 !text-sm text-cyan-400 font-semibold hover:bg-slate-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handlePostClick();
                    }}
                  >
                    投稿する
                  </button>

                  {status === "authenticated" ? (
                    <button
                      type="button"
                      className="text-left rounded-lg px-3 py-2 text-cyan-400 font-semibold hover:bg-slate-100"
                      onClick={() => {
                        setIsMenuOpen(false);
                        route.push("/profile");
                      }}
                    >
                      {session?.user?.name ?? "プロフィール"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-left !text-sm rounded-lg px-3 py-2 text-cyan-400 font-semibold hover:bg-slate-100"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLoginClick();
                      }}
                    >
                      ログイン / 新規登録
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

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
                      disabled={isPosting}
                      className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPosting ? "投稿中..." : "投稿する"}
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
