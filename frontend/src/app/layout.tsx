import Providers from "./providers";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import AppClientShell from "./AppClientShell";

const theme = createTheme({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head><ColorSchemeScript defaultColorScheme="auto" /></head>
      <body>
        <Providers>
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <AppClientShell>{children}</AppClientShell>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
