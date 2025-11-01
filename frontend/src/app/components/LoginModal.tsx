"use client";
import { useState } from "react";
import {
  Modal,
  Tabs,
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Group,
  Divider,
} from "@mantine/core";
import { signIn } from "next-auth/react";

type Props = { opened: boolean; onClose: () => void };

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : String(e);

export default function LoginModal({ opened, onClose }: Props) {
  const [emailL, setEmailL] = useState("");
  const [passL, setPassL] = useState("");
  const [emailS, setEmailS] = useState("");
  const [passS, setPassS] = useState("");
  const [nameS, setNameS] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loginEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/bff/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailL, password: passL }),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(t || `HTTP ${r.status}`);
      setMsg("ログイン成功");
      onClose();
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const signupEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/bff/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameS, email: emailS, password: passS }),
      });
      const t = await r.text();
      if (!r.ok) throw new Error(t || `HTTP ${r.status}`);
      setMsg("登録成功。ログインしてください。");
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      classNames={{
        content: "bg-white rounded-2xl text-sky-500 p-6",
        header: "border-b border-gray-200",
        title: "text-sky-600 font-semibold",
      }}
      opened={opened}
      onClose={onClose}
      title="ログイン / 新規登録"
      centered
    >
      <Stack>
        <Group grow>
          <Button
            className=""
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Googleでログイン
          </Button>
          <Button onClick={() => signIn("twitter", { callbackUrl: "/" })}>
            Xでログイン
          </Button>
        </Group>

        <Divider label="または" />

        <Tabs defaultValue="login">
          <Tabs.List>
            <Tabs.Tab value="login">メールでログイン</Tabs.Tab>
            <Tabs.Tab value="signup">新規登録</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="sm">
            <form onSubmit={loginEmail}>
              <Stack>
                <TextInput
                  label="メール"
                  value={emailL}
                  onChange={(e) => setEmailL(e.currentTarget.value)}
                  required
                  type="email"
                />
                <PasswordInput
                  label="パスワード"
                  value={passL}
                  onChange={(e) => setPassL(e.currentTarget.value)}
                  required
                />
                <Button type="submit" loading={busy}>
                  ログイン
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="signup" pt="sm">
            <form onSubmit={signupEmail}>
              <Stack>
                <TextInput
                  label="名前"
                  value={nameS}
                  onChange={(e) => setNameS(e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="メール"
                  value={emailS}
                  onChange={(e) => setEmailS(e.currentTarget.value)}
                  required
                  type="email"
                />
                <PasswordInput
                  label="パスワード"
                  value={passS}
                  onChange={(e) => setPassS(e.currentTarget.value)}
                  required
                />
                <Button type="submit" loading={busy}>
                  登録
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>
        </Tabs>

        {msg && <p>{msg}</p>}
      </Stack>
    </Modal>
  );
}
