// src/app/page.tsx
import "./globals.css";
import "@mantine/core/styles.css";
import  RoomsList  from "./components/RoomsList";

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

// 非同期関数の正しい書き方
const fetchRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bff/rooms`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
};

export default async function Home() {
  const rooms = await fetchRooms();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        <RoomsList rooms={rooms} />
      </div>
    </main>
  );
}
