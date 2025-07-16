"use client";

import { AnimatePresence, motion } from "framer-motion";
import GoogleLoginButton from "./GoogleLoginButton";

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
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] h-[90%] text-center items-center relative">
            <div className="mx-auto text-center items-center flex flex-col">
              <button
                className="mx-auto flex text-center items-center"
                onClick={setIsOpen}
              >
                戻る
              </button>
              <div className="text-2xl font-bold text-cyan-400">
                SNSでログインx
              </div>
              <GoogleLoginButton />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoomPopupUp;
