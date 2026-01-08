"use client";

import { Button } from "@headlessui/react";

type Props = {
  onClick: (e: React.MouseEvent) => void;
};

const RoomMenuButton = ({ onClick }: Props) => {
  return (
    <Button
      type="button"
      aria-label="ルーム操作"
      className="relative sm:w-5 w-4 bg-slate-200/80 hover:bg-slate-300 flex items-stretch justify-center"
      onClick={onClick}
    >
      {/* 縦3本線（|||） */}
      <span className="absolute inset-y-2 left-1/2 -translate-x-1/2 flex gap-[3px]">
        <span className="sm:w-[1.5px] w-[1px] h-full bg-slate-600 rounded" />
        <span className="sm:w-[1.5px] w-[1px] h-full bg-slate-600 rounded" />
        <span className="sm:w-[1.5px] w-[1px] h-full bg-slate-600 rounded" />
      </span>
    </Button>
  );
};

export default RoomMenuButton;
