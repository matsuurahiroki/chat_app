"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token");

  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (!token) {
        setOk(false);
        setErrors(["トークンがありません"]);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/bff/confirm?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setOk(true);
      } else {
        setOk(false);
        setErrors(data?.errors ?? [data?.error ?? "確認に失敗しました"]);
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <div className="p-6">確認中...</div>;

  if (ok) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-lg font-semibold">メール確認が完了しました</h1>
        <button
          className="px-4 py-2 rounded bg-cyan-500 text-white"
          onClick={() => router.push("/")}
        >
          ホームへ
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-lg font-semibold text-red-600">メール確認に失敗しました</h1>
      <ul className="list-disc pl-5 text-sm text-slate-700">
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
