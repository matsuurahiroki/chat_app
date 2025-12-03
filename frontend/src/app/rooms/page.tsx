// /src/app/rooms/[id]/page.tsx
import { RoomChat } from "../components/RoomChat";

type Props = {
  params: {
    id: string; // /rooms/1 の 1 が入る
  };
};

export default function RoomPage({ params }: Props) {
  const roomId = Number(params.id);

  return (
    <main className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col border-x border-slate-200 bg-white">
        <RoomChat roomId={roomId} />
      </div>
    </main>
  );
}
