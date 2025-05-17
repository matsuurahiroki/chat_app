"use client";

import { getProviders, signIn,  } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const Login = () => {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);

  useEffect(() => {
    // 非同期処理で認証プロバイダーを取得
    const fetchProviders = async () => {
      try {
        const res = await getProviders();
        setProviders(res as Record<string, Provider>);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      }
    };

    fetchProviders(); // 非同期関数を呼び出し
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {providers ? (
          Object.values(providers).map((provider) => (
            <div key={provider.id}>
              <button
                onClick={() => signIn(provider.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {provider.name}
              </button>
            </div>
          ))
        ) : (
          <p>Loading providers...</p>
        )}
      </div>
    </div>
  );
};

export default Login;
