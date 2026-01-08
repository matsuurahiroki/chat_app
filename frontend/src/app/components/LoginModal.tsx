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

export default function LoginModal({ opened, onClose }: Props) {
  const [emailL, setEmailL] = useState("");
  const [passL, setPassL] = useState("");
  const [emailS, setEmailS] = useState("");
  const [passS, setPassS] = useState("");
  const [nameS, setNameS] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const humanize = (code: string) => {
    if (code === "email_not_confirmed")
      return "メール確認が必要です。確認メールのリンクを開いてください。";
    if (code === "invalid_credentials" || code === "CredentialsSignin")
      return "メールまたはパスワードが正しくありません。";
    if (code === "REGISTER_OK")
      return "確認メールを送信しました。メール内リンクを開いてからログインしてください。";
    return code;
  };

  const loginEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const res = await signIn("credentials", {
      email: emailL,
      password: passL,
      mode: "login",
      redirect: false,
    });

    if (res?.error) {
      setMsg({ type: "error", text: humanize(res.error) });
    } else {
      setMsg(null);
      onClose();
    }

    setBusy(false);
  };

  const signupEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const res = await signIn("credentials", {
      email: emailS,
      password: passS,
      name: nameS,
      mode: "register",
      redirect: false,
    });

    if (res?.error === "REGISTER_OK") {
      setMsg({ type: "success", text: humanize("REGISTER_OK") });

      // ログインタブへ戻す（ついでにログイン欄へメールをコピー）
      setEmailL(emailS);
      setPassL("");
      setBusy(false);
      return;
    }

    if (res?.error) {
      setMsg({ type: "error", text: humanize(res.error) });
    } else {
      // 万一ここに来た場合も成功表示
      setMsg({
        type: "success",
        text: "登録しました。確認メールを開いてからログインしてください。",
      });
    }

    setBusy(false);
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} centered>
      <Modal.Overlay className="bg-black/10" />

      <Modal.Content className=" !rounded-2xl text-cyan-400 md:!p-6 sm:!p-4">
        <Modal.Header className="bg-white text-cyan-400">
          <Modal.Title className=" text-cyan-400 !font-semibold  !text-sm sm:!text-base shrink-0 whitespace-nowrap">
            ログイン / 新規登録
          </Modal.Title>
          <Modal.CloseButton className="!bg-transparent !hover:bg-transparent !text-cyan-400" />
        </Modal.Header>

        <Modal.Body>
          <Stack>
            <Group className="!w-full !flex !flex-grow-1 gap-2 sm:[&>*]:!flex-1 [&>*]:!w-full !flex-col sm:!flex-row">
              <Button
                className=" !bg-cyan-400 text-white !hover:text-gray-200 !hover:bg-cyan-600 !font-semibold sm:!text-sm !text-xs shrink-0 whitespace-nowrap"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Googleでログイン
              </Button>

              <Button
                className="!bg-cyan-400 text-white !hover:text-gray-200 !hover:bg-cyan-600 !font-semibold sm:!text-sm !text-xs shrink-0 whitespace-nowrap"
                onClick={() => signIn("twitter", { callbackUrl: "/" })}
              >
                Xでログイン
              </Button>
            </Group>

            <Divider
              className=" pt-2 !font-semibold sm:!text-sm !text-xs"
              label="または"
            />

            <Tabs defaultValue="login" variant="unstyled">
              <Tabs.List className="p-1 !flex !flex-col sm:!flex-row border-b border-gray-200">
                <Tabs.Tab
                  value="login"
                  className="flex-1 bg-white text-cyan-400 font-semibold py-2 !border-0 hover:bg-gray-200 hover:text-cyan-600 hover:!border-b-2 hover:!border-gray-300 data-[active=true]:!border-b-2 data-[active=true]:!border-cyan-500 sm:!text-sm !text-xs"
                >
                  メールでログイン
                </Tabs.Tab>

                <Tabs.Tab
                  value="signup"
                  className="flex-1 bg-white text-cyan-400 font-semibold py-2 !border-0 hover:bg-gray-200 hover:text-cyan-600 hover:!border-b-2 hover:!border-gray-300 data-[active=true]:!border-b-2 data-[active=true]:!border-cyan-500 sm:!text-sm !text-xs"
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
                        input: "border-none !bg-gray-200 text-black",
                        label: "font-semibold sm:!text-sm !text-xs",
                      }}
                    />

                    <PasswordInput
                      label="パスワード"
                      value={passL}
                      onChange={(e) => setPassL(e.currentTarget.value)}
                      required
                      classNames={{
                        input:
                          "!border-none !bg-gray-200 text-black focus:ring-cyan-400 focus:border-cyan-400",
                        label: "font-semibold sm:!text-sm !text-xs",
                      }}
                    />

                    <Button
                      type="submit"
                      loading={busy}
                      className="!bg-cyan-400 text-white hover:text-gray-200 !hover:bg-cyan-600 !font-semibold sm:!text-sm !text-xs"
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
                      classNames={{
                        input: "border-none !bg-gray-200 text-black",
                        label: "font-semibold sm:!text-sm !text-xs",
                      }}
                    />

                    <TextInput
                      label="メール"
                      value={emailS}
                      onChange={(e) => setEmailS(e.currentTarget.value)}
                      required
                      type="email"
                      classNames={{
                        input: "border-none !bg-gray-200 text-black",
                        label: "font-semibold sm:!text-sm !text-xs",
                      }}
                    />

                    <PasswordInput
                      label="パスワード"
                      value={passS}
                      onChange={(e) => setPassS(e.currentTarget.value)}
                      required
                      classNames={{
                        input: "border-none !bg-gray-200 text-black",
                        label: "font-semibold sm:!text-sm !text-xs",
                      }}
                    />

                    <Button
                      type="submit"
                      loading={busy}
                      className="!bg-cyan-400 text-white hover:text-gray-200 !hover:bg-cyan-600 !font-semibold sm:!text-sm !text-xs"
                    >
                      登録
                    </Button>
                  </Stack>
                </form>
              </Tabs.Panel>
            </Tabs>

            {msg && (
              <p className="mt-2 font-semibold text-red-500 whitespace-pre-line">
                {msg.text}
              </p>
            )}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
