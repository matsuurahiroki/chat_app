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
        content: "bg-white rounded-2xl text-cyan-400 p-6",
        header: "bg-white text-cyan-400",
        title: "text-cyan-400 font-semibold text-xl",
      }}
      opened={opened}
      onClose={onClose}
      title="ログイン / 新規登録"
      centered
    >
      <Stack>
        <Group grow>
          <Button
            className="bg-cyan-400 text-white hover:text-gray-200 hover:bg-cyan-600 font-semibold"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Googleでログイン
          </Button>
          <Button
            className="bg-cyan-400 text-white  hover:text-gray-200 hover:bg-cyan-600 font-semibold"
            onClick={() => signIn("twitter", { callbackUrl: "/" })}
          >
            Xでログイン
          </Button>
        </Group>

        <Divider className="font-semibold" label="または" />

        <Tabs defaultValue="login">
          <Tabs.List className="p-1">
            <Tabs.Tab
              value="login"
              className="bg-white text-cyan-400 font-semibold hover:bg-gray-200 hover:text-cyan-600  !border-0 hover: hover:!border-b-2 hover:!border-gray-300
              data-[active=true]:!border-b-2 data-[active=true]:!border-cyan-500"
            >
              メールでログイン
            </Tabs.Tab>
            <Tabs.Tab
              value="signup"
              className="bg-white text-cyan-400 font-semibold hover:bg-gray-200 hover:text-cyan-600  !border-0 hover:!border-b-2 hover:!border-none
              data-[active=true]:!border-b-2 data-[active=true]:!border-cyan-500"
            >
              新規登録
            </Tabs.Tab>
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
                  classNames={{
                    input:
                      "border-none bg-gray-200 text-black",
                    label: "font-semibold",
                  }}
                />
                <PasswordInput
                  label="パスワード"
                  value={passL}
                  onChange={(e) => setPassL(e.currentTarget.value)}
                  required
                  classNames={{
                    input:
                      "border-none bg-gray-200 text-black",
                    label: "font-semibold",
                  }}
                />
                <Button
                  type="submit"
                  loading={busy}
                  className="bg-cyan-400 text-white hover:text-gray-200 hover:bg-cyan-600 font-semibold hover:border-gray-300  "
                >
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
                <Button
                  type="submit"
                  loading={busy}
                  className="bg-cyan-400 text-white hover:text-gray-200 hover:bg-cyan-600 font-semibold"
                >
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
