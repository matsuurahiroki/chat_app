"use client";

import { useState } from "react";
import RoomPopupUp from "./RoomPopupUp";
import "@mantine/core/styles.css";
import { Input, Button, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import LoginPopupUp from "./LoginPopupUp";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePoppup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-white border shadow-xl fixed">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 "
        aria-label="Global"
      >
        <div className=" flex items-center">
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={togglePoppup}
              className="text-base font-bold  leading-6 text-cyan-400 hover:text-cyan-600 px-5"
            >
              ルームを作る
            </button>
            <button
              onClick={togglePoppup}
              className="text-base font-bold  leading-6 text-cyan-400 hover:text-cyan-600 px-5"
            >
              ログイン
            </button>
          </div>
        </div>
        <div className="flex h-full mr-20">
          <Input
            placeholder="検索"
            radius="xl"
            size="md"
            className="w-full"
            classNames={{
              input: "bg-white shadow border-gray-300 focus:border-blue-500",
            }}
            rightSectionWidth={rem(90)}
            rightSection={
              <Button size="xs" radius="xl" color="none">
                <IconSearch size={20} color="cyan" />
              </Button>
            }
          />
        </div>
      </nav>
      {/*
      <RoomPopupUp isOpen={isOpen} setIsOpen={togglePoppup} />
       */}
      <LoginPopupUp isOpen={isOpen} setIsOpen={togglePoppup}/>
    </header>
  );
};

export default Header;
