// src/app/components/RoomsList.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { MouseEvent } from "react";

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
  // 既存のログインモーダルを開きたいとき用（必要なければ使わなくてOK）
  onLoginClick?: () => void;
};

const RoomsList = ({ rooms, onLoginClick }: Props) => {
  const { status } = useSession();

  const handleRoomClick = () => (e: MouseEvent<HTMLAnchorElement>) => {
    if (status !== "authenticated") {
      e.preventDefault(); // リンク遷移を止める
      alert("ルームを閲覧するにはログインが必要です。");

      if (onLoginClick) {
        onLoginClick(); // ログインモーダルを開くなど
      }

      return;
    }

    // ログイン済みなら何もしない → Link が普通に /rooms/:id へ遷移
  };

  if (rooms.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        まだ投稿がありません。「投稿する」から最初のルームを作成してみましょう。
      </p>
    );
  }

  return (
    <>
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/rooms/${room.id}`}
          onClick={handleRoomClick()}
        >
          <div className="rounded-2xl bg-white shadow-sm border border-slate-300 p-4 mb-3 hover:bg-slate-50 cursor-pointer">
            <h2 className="text-base font-semibold text-cyan-400">
              {room.title}
            </h2>
            <div className="flex items-center">
              <p className="font-normal text-cyan-400 pr-2">作成者:</p>
              <p className="font-normal">{room.user.name}</p>
              <p className="font-normal pl-4 text-cyan-400 pr-2">日にち: </p>
              <p>{new Date(room.created_at).toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default RoomsList;
