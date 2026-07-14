import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { ADMIN_PATH } from "./lib/admin-path";

const intlMiddleware = createMiddleware(routing);

const usingSecretAdminPath = ADMIN_PATH !== "admin";
const localesPattern = routing.locales.join("|");

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches "/admin", "/admin/foo", "/uz/admin", "/uz/admin/foo", etc.
const directAdminPath = new RegExp(`^/(?:(?:${localesPattern})/)?admin(?:/.*)?$`);
// Matches the configured secret path the same way, capturing the locale (if
// present) and the remaining subpath so we can rewrite to the real route.
const secretAdminPath = new RegExp(`^/(?:(${localesPattern})/)?${escapeRegex(ADMIN_PATH)}(/.*)?$`);

export default function proxy(req: NextRequest) {
  if (usingSecretAdminPath) {
    const { pathname } = req.nextUrl;

    // Hide that an admin panel exists at all at the well-known path.
    if (directAdminPath.test(pathname)) {
      return new NextResponse(null, { status: 404 });
    }

    const match = pathname.match(secretAdminPath);
    if (match) {
      const locale = match[1] ?? routing.defaultLocale;
      const rest = match[2] ?? "";
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin${rest}`;
      return NextResponse.rewrite(url);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
