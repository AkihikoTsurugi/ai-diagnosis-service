import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import ThemeRegistry from "./theme/ThemeRegistry";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "5問でわかる、あなたのキャリア｜SurvibeAI",
  description:
    "たった5問の質問に答えるだけで、AIがあなたに最適なキャリアロードマップを提案。就活・転職・キャリアチェンジを考えるすべての人へ。登録不要・完全無料。",
  openGraph: {
    title: "5問でわかる、あなたのキャリア｜SurvibeAI",
    description:
      "AIがあなたに最適なキャリアロードマップを提案します。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      {/* suppressHydrationWarning: ブラウザ拡張が <body> に属性を注入した場合の不一致を許容 */}
      <body suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
