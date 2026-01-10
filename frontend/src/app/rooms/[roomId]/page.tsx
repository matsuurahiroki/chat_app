// /src/app/rooms/[id]/page.tsx
import RoomChat from "../../components/RoomChat";
import { notFound } from "next/navigation";

// Next15以降ではparamsをPromise(awaitにしないといけない模様)
type Props = {
  params: Promise<{
    roomId: string; // URLパラメータは文字列で渡ってくる
  }>;
};

type Room = {
  id: number;
  title: string;
  created_at: string;
  created_at_text: string;
  user: {
    id: number;
    name: string;
  };
};

const fetchRoom = async (roomId: string): Promise<Room | null> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/bff/rooms/${roomId}`, {
    cache: "no-store",
  });

  // エラー時は null を返す（存在しないなど）
  if (!res.ok) return null;

  // 正常時は JSON を Room 型として返す
  return res.json();
  // {"id":1,"title":"テストルーム","created_at":"2025-12-05T10:00:00Z","user":{"id":5,"name":"山田太郎"}}
};

const RoomPage = async ({ params }: Props) => {
  // ここでparamsをawaitしてからidを取り出す
  const { roomId } = await params;

  // URL から来た id を使って BFF 経由でルーム情報を1件取得
  const room = await fetchRoom(roomId);

  if (!room) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-slate-300 flex mx-auto justify-center m-full">
      <div className="lg:w-11/12 w-full max-w-full flex flex-col border- bg-white" suppressHydrationWarning >
        <RoomChat roomId={room.id} roomTitle={room.title} roomTime={room.created_at_text} userName={room.user.name}/>
      </div>
    </main>
  );
};

export default RoomPage;

// <Link key={room.id} href={`/rooms/${room.id}`}> で設定した URL の [id] 部分が
// Next.js によって props.params に入り、ここで await してから使っている
