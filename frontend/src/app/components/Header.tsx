/* /src/app/components/Header.tsx */
"use client";

import { Fragment, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Dialog, Transition } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "@/lib/toastPopup";

type Props = {
  onLoginClick: () => void;
};

const Header = ({ onLoginClick }: Props) => {
  const route = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handlePostClick = () => {
    if (status !== "authenticated") {
      toast.error("投稿するにはログインが必要です");
      return;
    }
    setIsPostOpen(true);
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPosting) return;

    if (!postTitle.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }

    setIsPosting(true);
    try {
      const res = await fetch("/api/bff/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: postTitle.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(
          data?.error
            ? `投稿に失敗しました: ${data.error}`
            : "投稿に失敗しました",
        );
        return;
      }

      setPostTitle("");
      setIsPostOpen(false);
      await sleep(500);
      toast.success("投稿しました");

      if (pathname === "/") {
        route.refresh();
      } else {
        route.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("通信エラーが発生しました");
    } finally {
      setIsPosting(false);
    }
  };

  if (status === "loading") {
    return (
      <header className="fixed z-10 flex h-[50px] w-full items-center justify-center bg-white shadow-md md:h-[70px]" />
    );
  }

  const handleLoginClick = () => {
    if (pathname !== "/") {
      route.push("/");
      onLoginClick();
    } else {
      onLoginClick();
    }
  };

  return (
    <>
      <header className="fixed z-10 flex h-[50px] w-full items-center justify-center bg-white shadow-md md:h-[70px]">
        <div className="mx-9 flex h-full w-10/12 items-center justify-between">
          <Button
            className="whitespace-nowrap rounded-lg px-3 py-4 font-sans text-xs font-bold text-cyan-400 hover:bg-slate-100 sm:text-sm md:text-base"
            onClick={() => route.push("/")}
          >
            ホーム
          </Button>

          <nav className="hidden items-center gap-6 sm:flex">
            <Button
              type="button"
              className="mr-10 rounded-lg px-3 py-4 text-left text-xs font-semibold text-cyan-400 hover:bg-slate-100 sm:text-sm md:text-base"
              onClick={() => {
                setIsMenuOpen(false);
                handlePostClick();
              }}
            >
              投稿する
            </Button>

            {status === "authenticated" ? (
              <Button
                className="whitespace-nowrap rounded-lg px-3 py-4 text-xs font-semibold text-cyan-400 hover:bg-slate-100 sm:text-sm md:text-base"
                onClick={() => route.push("/profile")}
              >
                {session?.user?.name ?? "プロフィール"}
              </Button>
            ) : (
              <Button
                className="whitespace-nowrap rounded-lg px-3 py-4 font-sans text-xs font-bold text-cyan-400 hover:bg-slate-100 sm:text-sm md:text-base"
                onClick={handleLoginClick}
              >
                ログイン / 新規登録
              </Button>
            )}
          </nav>

          <button
            type="button"
            className="shrink-0 py-2 text-2xl font-bold text-cyan-400 sm:hidden md:text-base"
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
              enterFrom="translate-x-4 opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-4 opacity-0"
            >
              <Dialog.Panel className="h-full w-[75%] max-w-xs bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <Dialog.Title className="!text-md font-semibold text-cyan-400">
                    メニュー
                  </Dialog.Title>
                  <button
                    type="button"
                    className="block px-2 py-1 text-2xl font-bold text-cyan-400"
                    aria-label="閉じる"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className="text-left rounded-lg px-3 py-2 !text-sm font-semibold text-cyan-400 hover:bg-slate-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      route.push("/");
                    }}
                  >
                    ホーム
                  </button>

                  <button
                    type="button"
                    className="text-left rounded-lg px-3 py-2 !text-sm font-semibold text-cyan-400 hover:bg-slate-100"
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
                      className="text-left rounded-lg px-3 py-2 font-semibold text-cyan-400 hover:bg-slate-100"
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
                      className="text-left rounded-lg px-3 py-2 !text-sm font-semibold text-cyan-400 hover:bg-slate-100"
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

      <Transition appear show={isPostOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => {
            if (!isPosting) setIsPostOpen(false);
          }}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="mb-4 text-lg font-semibold text-cyan-400">
                  新規投稿
                </Dialog.Title>

                <form className="space-y-4" onSubmit={handlePostSubmit}>
                  <div>
                    <label
                      htmlFor="post-title"
                      className="mb-1 block text-sm font-semibold text-cyan-400"
                    >
                      タイトル
                    </label>
                    <input
                      id="post-title"
                      type="text"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="いまどうしてる？"
                      disabled={isPosting}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700"
                      onClick={() => setIsPostOpen(false)}
                      disabled={isPosting}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPosting}
                      className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
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
};

export default Header;
