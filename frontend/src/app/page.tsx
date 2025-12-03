import "./globals.css";
import "@mantine/core/styles.css";
import Link from "next/link";

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

async function fetchRooms(): Promise<Room[]> {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bff/rooms`, {
    // App Router のサーバーコンポーネントなので SSR fetch 想定
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function home() {
  const rooms = await fetchRooms();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        {rooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.id}`}>
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 mb-3 hover:bg-slate-50 cursor-pointer">
              <h2 className="text-base font-semibold text-cyan-400">
                {room.title}
              </h2>
              <p className="text-xs text-slate-800 mt-1">
                作成者: {room.user.name}
              </p>
            </div>
          </Link>
        ))}

        {rooms.length === 0 && (
          <p className="text-sm text-slate-600">
            まだ投稿がありません。「投稿する」から最初のルームを作成してみましょう。
          </p>
        )}
      </div>
    </main>
  );
}
