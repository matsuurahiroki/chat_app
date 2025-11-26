// frontend/src/app/layout.tsx

import "./globals.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import AppClientShell from "./AppClientShell";
import AppProviders from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <AppProviders>
          <AppClientShell>{children}</AppClientShell>
        </AppProviders>
      </body>
    </html>
  );
}
