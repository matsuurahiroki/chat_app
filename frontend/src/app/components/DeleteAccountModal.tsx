"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button, Modal, PasswordInput, Stack, Text } from "@mantine/core";
import { toast } from "@/lib/toastPopup";

type Props = {
  opened: boolean;
  onClose: () => void;
};

const DeleteAccountModal = ({ opened, onClose }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;

    if (!currentPassword.trim()) {
      toast.error("現在のパスワードを入力してください。");
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const response = await fetch("/api/bff/user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          responseData?.error ?? "アカウント削除に失敗しました。";
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("アカウントを削除しました。");

      await fetch("/api/bff/auth/logout", { method: "DELETE" }).catch(
        () => null,
      );
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      setMessage("通信エラーが発生しました。");
      toast.error("通信エラーが発生しました。");
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setCurrentPassword("");
    setMessage(null);
    onClose();
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} centered>
      <Modal.Overlay className="bg-black/10" />

      <Modal.Content className="!rounded-2xl text-cyan-400 md:!p-6 sm:!p-4">
        <Modal.Header className="bg-white text-cyan-400">
          <Modal.Title className="text-cyan-400 !font-semibold !text-sm sm:!text-base shrink-0 whitespace-nowrap">
            アカウント削除
          </Modal.Title>
          <Modal.CloseButton className="!bg-transparent !hover:bg-transparent !text-cyan-400" />
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleDeleteAccount}>
            <Stack>
              <Text className="text-slate-700 sm:!text-sm !text-xs">
                アカウントを削除すると、このアカウントは二度と使用できなくなります。
              </Text>

              <Text className="text-red-500 font-semibold sm:!text-sm !text-xs">
                本当に削除する場合のみ、現在のパスワードを入力してください。
              </Text>

              <PasswordInput
                label="現在のパスワード"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.currentTarget.value)
                }
                required
                classNames={{
                  input:
                    "!border-none !bg-gray-200 text-black focus:ring-cyan-400 focus:border-cyan-400",
                  label: "font-semibold sm:!text-sm !text-xs",
                }}
              />

              {message && (
                <p className="mt-1 font-semibold text-red-500 whitespace-pre-line sm:text-sm text-xs">
                  {message}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleClose}
                  disabled={busy}
                  className="sm:flex-1 !font-semibold sm:!text-sm !text-xs !bg-cyan-400 !text-white hover:!bg-cyan-600"
                >
                  キャンセル
                </Button>

                <Button
                  type="submit"
                  loading={busy}
                  color="red"
                  className="sm:flex-1 !bg-red-500 text-white hover:!bg-red-600 !font-semibold sm:!text-sm !text-xs"
                >
                  アカウントを削除
                </Button>
              </div>
            </Stack>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default DeleteAccountModal;
