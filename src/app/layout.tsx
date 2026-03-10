// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Header } from "./_components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname(); //現在のURLパスを取得
  const isAdmin = pathName.startsWith("/admin"); //パスが/adminで始まるかどうかを判定
  return (
    <html lang="en">
      <body>
        {!isAdmin && <Header />} {/*管理者ページではこのヘッダーを表示しない*/}
        {children}
      </body>
    </html>
  );
}
