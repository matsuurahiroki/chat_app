// src/app/components/RoomsList.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import RoomMenuButton from "./RoomMenuButton";
import ConfirmPopup from "./ConfirmPopup";

const formatJST = (iso: string) =>
  new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

type Room = {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
};

type Props = {
  rooms: Room[];
  onLoginClick?: () => void;
};

const RoomsList = ({ rooms, onLoginClick }: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const myUserId = session?.userId ? Number(session.userId) : null;

  const [list, setList] = useState<Room[]>(rooms);

  // rooms が増減された場合、再描画
  useEffect(() => {
    setList(rooms);
  }, [rooms]);

  // ポップアップ
  const [confirmRoom, setConfirmRoom] = useState<Room | null>(null);
  const [busy, setBusy] = useState(false);

  const handleRoomClick = () => (e: MouseEvent<HTMLAnchorElement>) => {
    if (status !== "authenticated") {
      e.preventDefault();
      alert("ルームを閲覧するにはログインが必要です。");
      onLoginClick?.();
    }
  };

  const onDelete = async () => {
    if (!confirmRoom || busy) return;

    setBusy(true);
    try {
      const res = await fetch(`/api/bff/rooms/${confirmRoom.id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.error ?? "削除に失敗しました");
        return;
      }

      // 画面から消す
      setList((prev) => prev.filter((r) => r.id !== confirmRoom.id));
      setConfirmRoom(null);

      // サーバー側の一覧も更新したいなら
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (list.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        まだ投稿がありません。「投稿する」から最初のルームを作成してみましょう。
      </p>
    );
  }

  return (
    <>
      {list.map((room) => {
        const canDelete =
          mounted &&
          status === "authenticated" &&
          Number(myUserId) === Number(room.user_id);

        return (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            onClick={handleRoomClick()}
            className="!cursor-pointer"
          >
            <div className="rounded-2xl bg-white shadow-sm border border-slate-300 mb-3 hover:bg-slate-50 overflow-hidden flex items-stretch ">
              <div className="min-w-0 flex-1 p-2 pr-0 sm:p-4 sm:pr-0">
                <h2 className="text-[10px] line-clamp-3 sm:text-sm md:text-base font-semibold text-cyan-400 break-words">
                  {room.title}
                </h2>

                <div className="flex items-center min-w-0">
                  <p className="font-normal text-cyan-400 sm:pr-2 pr-1 text-[10px] sm:text-sm md:text-base truncate whitespace-nowrap">
                    作成者:
                  </p>
                  <p className="font-normal text-[10px] sm:text-sm md:text-base truncate whitespace-nowrap">
                    {room.user.name}
                  </p>
                  <p className="font-normal sm:pl-4 pl-2 text-cyan-400 sm:pr-2 pr-1 text-[10px] sm:text-sm md:text-base truncate whitespace-nowrap">
                    時間:
                  </p>
                  <p className="text-[10px] sm:text-sm md:text-base truncate whitespace-nowrap">
                    {formatJST(room.created_at)}
                  </p>
                </div>
              </div>

              {canDelete && (
                <RoomMenuButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmRoom(room);
                  }}
                />
              )}
            </div>
          </Link>
        );
      })}

      <ConfirmPopup
        open={!!confirmRoom}
        title="ルームを削除しますか？"
        busy={busy}
        onCancel={() => {
          if (!busy) setConfirmRoom(null);
        }}
        onConfirm={onDelete}
      />
    </>
  );
};

export default RoomsList;
