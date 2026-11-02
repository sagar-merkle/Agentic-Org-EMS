import "./globals.css";
import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/shell/Shell";

export const metadata: Metadata = { title: "Agentic org-EMS | TVS Motor", description: "EMS with AI agents (wireframe demo)" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
