import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Role-Based Auth App",
  description: "A simple role-based authentication application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
