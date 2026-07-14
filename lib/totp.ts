import "server-only";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const ISSUER = "To'yxonaTop";

export function generateTotpSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

function buildTotp(email: string, base32Secret: string) {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });
}

export async function generateTotpQrCode(email: string, base32Secret: string): Promise<string> {
  const totp = buildTotp(email, base32Secret);
  return QRCode.toDataURL(totp.toString());
}

export function verifyTotpCode(email: string, base32Secret: string, code: string): boolean {
  const totp = buildTotp(email, base32Secret);
  // window: 1 tolerates the code from one 30s step before/after (clock drift).
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
