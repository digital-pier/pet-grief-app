import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@sharedleash.com";

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your Shared Leash password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #78350f;">Reset your password</h2>
        <p style="color: #92400e; line-height: 1.6;">
          We received a request to reset your Shared Leash password. Click the button below to choose a new one.
        </p>
        <a href="${resetLink}"
           style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Reset password
        </a>
        <p style="color: #a8a29e; font-size: 14px; line-height: 1.5;">
          This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
