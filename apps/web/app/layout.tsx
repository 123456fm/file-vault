import "./globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "File Vault",
  description: "Simple file management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="main-layout">{children}</div>
      </body>
    </html>
  );
}
