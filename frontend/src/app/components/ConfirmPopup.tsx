"use client";

import { Button } from "@headlessui/react";

type Props = {
  open: boolean;
  title: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmPopup = ({
  open,
  title,
  busy = false,
  onCancel,
  onConfirm,
}: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel} // 背景クリックで閉じる
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white shadow-lg border border-slate-200 p-4"
        onClick={(e) => e.stopPropagation()} // 中身クリックでは閉じない
      >
        <h3 className="sm:text-base text-sm font-semibold text-slate-800">
          {title}
        </h3>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            className="px-3 py-2 sm:text-sm text-xs rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            onClick={onCancel}
            disabled={busy}
          >
            いいえ
          </Button>

          <Button
            type="button"
            className="px-3 py-2 sm:text-sm text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "削除中..." : "はい"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmPopup;
