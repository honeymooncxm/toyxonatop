import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ALERT_EMAIL = process.env.SECURITY_ALERT_EMAIL || process.env.ADMIN_EMAIL;

/**
 * Fire-and-forget email via the Resend HTTP API (no SDK needed for one call
 * site). No-ops silently when RESEND_API_KEY isn't configured, same fallback
 * pattern as lib/cloudinary.ts — the app works out of the box without it.
 */
async function sendEmail(to: string, subject: string, text: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "To'yxonaTop Security <security@toyxonatop.uz>",
        to,
        subject,
        text,
      }),
    });
  } catch {
    // Best-effort notification — never let an email failure break login.
  }
}

export async function notifyFailedLoginBurst(email: string, failureCount: number) {
  if (!ALERT_EMAIL) return;
  await sendEmail(
    ALERT_EMAIL,
    `[To'yxonaTop] ${failureCount} failed login attempts for ${email}`,
    `There have been ${failureCount} failed login attempts for the account "${email}" in the last 5 minutes. If this wasn't you, consider that this account may be under attack — the account locks automatically after 5 failed attempts from the same IP for 30 minutes.`,
  );
}
