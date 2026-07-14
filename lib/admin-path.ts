/**
 * The externally-visible URL segment for the admin panel. Defaults to
 * "admin" (open) unless NEXT_PUBLIC_ADMIN_PATH is set to something else, in
 * which case the literal /admin path starts 404-ing and only this value
 * works (see proxy.ts). Must be NEXT_PUBLIC_ because the navbar's "Admin
 * panel" link needs to render it client-side — which also means this is
 * obscurity, not real access control: it stops automated scanners probing
 * well-known paths, not someone who reads the page source. The actual
 * security boundary is the ADMIN-role session check in app/[locale]/admin/layout.tsx.
 */
export const ADMIN_PATH = (process.env.NEXT_PUBLIC_ADMIN_PATH?.trim() || "admin").replace(/^\/+|\/+$/g, "");
