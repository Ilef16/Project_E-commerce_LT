import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { dirOf, isLocale, t } from "@/lib/i18n";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { title: "Louli's Touch" };
  return {
    title: "Louli's Touch",
    description: t(locale, "hero.text"),
    icons: { icon: "/images/logo.png" },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      {/* Patch html attributes for the correct locale — suppressHydrationWarning on root layout allows this */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${locale}";document.documentElement.dir="${dirOf(locale)}";`,
        }}
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500&family=Cairo:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <noscript>
        <style>{`.rv{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      {children}
    </>
  );
}
