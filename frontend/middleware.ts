import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["fr", "ar"];
const DEFAULT = "fr";

// "/" et toute URL sans préfixe de langue → /fr ou /ar (cookie "lang", puis Accept-Language).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  const saved = req.cookies.get("lang")?.value;
  const locale =
    saved && LOCALES.includes(saved)
      ? saved
      : (req.headers.get("accept-language") ?? "").toLowerCase().startsWith("ar")
        ? "ar"
        : DEFAULT;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|images|backend|favicon.ico|.*\\..*).*)"],
};
