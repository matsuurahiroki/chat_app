"use client";

import { Button, Input } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

interface PopupMenuProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const RoomPopupUp = ({ isOpen, setIsOpen }: PopupMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 w-full flex items-center justify-center bg-gray-900 bg-opacity-80 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/5 h-3/5 text-center items-center relative">
            <div className="text-2xl font-bold mb-10 text-cyan-400">
              新規投稿をする
            </div>
            <Input
              type="search"
              id="default-search"
              className="mt-10 block w-full p-3 px-11 text-base text-gray-900 border border-gray-300 rounded-2xl bg-gray-100 hover:bg-gray-200 focus:outline-none "
              placeholder="投稿したい内容を記入してください"
              required
            />
            <Button
              onClick={setIsOpen}
              className="absolute bottom-10 left-10 text-white w-2/5 py-3 rounded-full bg-red-600 hover:bg-red-800"
            >
              閉じる
            </Button>
            <Button className="absolute bottom-10 right-10 text-white w-2/5 py-3 rounded-full bg-cyan-400 hover:bg-cyan-600">
              投稿
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoomPopupUp;
