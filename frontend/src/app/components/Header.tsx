/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@headlessui/react";
import { useSession } from "next-auth/react";
import PopupUp from "./PopupUp";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const togglePoppup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white border shadow-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 "
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Image
              src="/images/logo_transparent.png"
              width={40}
              height={40}
              className="h-auto w-auto p-0 ml-10"
              alt={""}
            />
          </a>
        </div>
        <div className=" flex items-center">
          <div className="flex h-full mr-10 ">
            <form className="max-w-md mx-auto">
              <div className="relative w-full">
                <Input
                  type="search"
                  id="default-search"
                  className="block w-full p-3 px-11 text-base text-gray-900 border border-gray-300 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none "
                  placeholder="検索"
                  required
                />
                <Button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 font-bold h-full text-white bg-cyan-400 rounded-e-2xl  border-blue-700 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-blue-300 flex justify-center items-center"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </form>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button
              onClick={togglePoppup}
              className="text-base font-bold  leading-6 text-cyan-400 hover:text-cyan-600 px-5"
            >
              ルームを作る
            </Button>
            <Link
              href="/login"
              className="text-base font-bold  leading-6 text-cyan-400 hover:text-cyan-600 px-5"
            >
              ログイン
            </Link>
          </div>
        </div>
      </nav>
      <PopupUp isOpen={isOpen} togglePoppup={togglePoppup} />
    </header>
  );
};

export default Header;
