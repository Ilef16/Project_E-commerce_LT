import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Louli's Touch",
  icons: { icon: "/images/logo.png" },
};

// Root layout — lang/dir defaults; the [locale] segment overrides them via generateMetadata + suppressHydrationWarning.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
