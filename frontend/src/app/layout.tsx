import './globals.css'; // ✅ これがないと Tailwind は動かない
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css"; // Mantine のスタイルをインポート
import Header from "./components/Header";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";


const inter = Inter({ subsets: ["latin"] });

// テーマ設定
const theme = createTheme({
  colors: {
    cyan: [
      "#E0F7FA",
      "#B2EBF2",
      "#80DEEA",
      "#4DD0E1",
      "#26C6DA",
      "#00BCD4",
      "#00ACC1",
      "#0097A7",
      "#00838F",
      "#006064",
    ],
  },
});
export const metadata = {
  title: "My Mantine App",
  description: "My Mantine app using Next.js 13 with src/app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <MantineProvider theme={theme}>
          <Header />
          {children}
        </MantineProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
