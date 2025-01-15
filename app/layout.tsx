import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Hive",
  description: "Chat freely and securely in Chat Hive!!!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
