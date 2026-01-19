"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";

const AppClientShell = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") setOpen(false);
  }, [status]);

  return (
    <>
      <Header
        onLoginClick={() => status !== "authenticated" && setOpen(true)}
      />
      {status !== "authenticated" && (
        <LoginModal opened={open} onClose={() => setOpen(false)} />
      )}
      <div className="md:pt-[70px] pt-[50px]">{children}</div>
    </>
  );
}

export default AppClientShell;
