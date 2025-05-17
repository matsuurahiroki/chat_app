import Image from "next/image";
import type { NextPage } from "next";

const Card: NextPage = () => {
  return (
    <div className="mh-screen bg-gray-200 p-10">
      <div className=" grid max-w-7xl place-items-center gap-5 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex justify-center  border">
            <a
              href=""
              className="absolute top-2 left-2 rounded-3xl bg-cyan-400 py-1 px-2 text-xs font-bold text-white"
            >
              TECH
            </a>
            <div className="p-10 flex items-center">
              <Image
                src="/images/logo_transparent.png"
                width={40}
                height={40}
                className="h-auto w-auto p-0 rounded-full"
                alt={""}
              />
            </div>
          </div>
          <div className="space-y-4 p-4">
            <div className="mb-6 text-lg font-bold text-gray-500">
              Next.js : CSR SSG SSRについて
            </div>
            <div className="space-x-2 leading-3">
              <a className="rounded-md bg-cyan-400 py-1 px-2 text-xs font-bold text-white">
                React
              </a>
              <a className="rounded-md bg-cyan-400 py-1 px-2 text-xs font-bold text-white">
                JavaScript
              </a>
              <a className="rounded-md bg-cyan-400 py-1 px-2 text-xs font-bold text-white">
                TailwindCSS
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <div className="space-y-1">
                <div className="pt-1 text-xs text-gray-500">5日前・2min read</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
