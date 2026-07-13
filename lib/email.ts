import nodemailer from "nodemailer";

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.EMAIL_FROM?.trim()
  );
}

function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error("Email is not configured");
  }

  const port = Number(process.env.SMTP_PORT || "587");
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Resend + many hosts expect STARTTLS on 587
    requireTLS: !secure && port === 587,
  });
}

export async function sendPasswordResetEmail(options: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> {
  const brand = process.env.EMAIL_FROM_NAME?.trim() || "GroupBuy Tools";
  const from = process.env.EMAIL_FROM!.trim();
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${brand}" <${from}>`,
    to: options.to,
    subject: `Reset your ${brand} password`,
    text: [
      `Hi ${options.name},`,
      "",
      `We received a request to reset your ${brand} password.`,
      "Click the link below (valid for 1 hour):",
      options.resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
        <h2 style="margin:0 0 12px;font-size:22px">Reset your password</h2>
        <p style="margin:0 0 16px;line-height:1.5">Hi ${escapeHtml(options.name)},</p>
        <p style="margin:0 0 20px;line-height:1.5">
          We received a request to reset your <strong>${escapeHtml(brand)}</strong> password.
          This link expires in <strong>1 hour</strong>.
        </p>
        <p style="margin:0 0 28px">
          <a href="${options.resetUrl}"
             style="display:inline-block;background:#197CC0;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700">
            Reset password
          </a>
        </p>
        <p style="margin:0 0 8px;font-size:13px;color:#666;line-height:1.5">
          Or copy this link:<br/>
          <a href="${options.resetUrl}" style="color:#197CC0;word-break:break-all">${options.resetUrl}</a>
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#666">
          If you did not request this, you can ignore this email.
        </p>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildPasswordResetUrl(token: string): string {
  const base = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}
