// src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <MantineProvider>
        <Notifications
          position="top-center"
          limit={1}
          zIndex={3000}
        />
        {children}
      </MantineProvider>
    </SessionProvider>
  );
};

export default AppProviders;
