"use client";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ClientSafeProvider } from "next-auth/react";

export default function Page() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  useEffect(() => { getProviders().then(setProviders); }, []);
  if (!providers) return <p>Loading...</p>;
  return (
    <div className="p-8 space-y-3">
      {Object.values(providers).map((p) => (
        <button key={p.id} onClick={() => signIn(p.id, { callbackUrl: "/dashboard" })}
          className="px-4 py-2 rounded bg-cyan-400 text-white">{p.name}</button>
      ))}
    </div>
  );
}
