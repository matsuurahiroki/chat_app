"use client";

import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/social/login/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const data = await res.json();
      console.log("JWT:", data.access);
    },
    onError: () => {
      console.error("Googleログイン失敗");
    },
    scope: "openid email profile",
    flow: 'implicit',
  });

  return (
    <button onClick={() => login()} className="bg-blue-500 text-white px-4 py-2 rounded-md">
      Googleでログイン
    </button>
  );
}