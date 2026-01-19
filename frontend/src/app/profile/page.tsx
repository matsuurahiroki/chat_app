// src/app/profile/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/nextauth/auth";
import  SettingTabs  from "../components/SettingTabs"; // ← 新しく作るクライアントコンポーネント

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const userName = session.user?.name ?? "";
  const userEmail = session.user?.email ?? "";
  const userId = (session).userId ?? "不明";

  return (
    <SettingTabs
      initialName={userName}
      initialEmail={userEmail}
      userId={String(userId)}
    />
  );
}
