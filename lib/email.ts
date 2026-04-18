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

export async function sendEmailVerificationEmail(email: string, name: string, token: string): Promise<void> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyLink = `${appUrl}/auth/verify?token=${token}`;
  const firstName = name.split(" ")[0];

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your Shared Leash email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #78350f;">Welcome to Shared Leash, ${firstName}</h2>
        <p style="color: #92400e; line-height: 1.6;">
          Thank you for joining. Please verify your email address to access your companion.
        </p>
        <a href="${verifyLink}"
           style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Verify my email
        </a>
        <p style="color: #a8a29e; font-size: 14px; line-height: 1.5;">
          This link expires in 24 hours. If you didn't create a Shared Leash account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const firstName = name.split(" ")[0];

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Shared Leash — you're not alone",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #78350f;">Welcome to Shared Leash, ${firstName} 🐾</h2>
        <p style="color: #92400e; line-height: 1.6;">
          Thank you for joining Shared Leash — a compassionate AI companion for people
          grieving the loss of a beloved pet. You're not alone, and we're here for you
          any time of day or night.
        </p>
        <p style="color: #92400e; line-height: 1.6;">
          Whenever you're ready, you can start a conversation, share your favorite
          memories, or simply talk through what you're feeling. There's no rush and
          no judgment — just a gentle space to be heard.
        </p>
        <a href="${appUrl}"
           style="display: inline-block; background: #d97706; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Start Your Journey
        </a>
        <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
          Your free plan includes <strong>5 chat sessions per month</strong> — enough
          to start finding comfort at your own pace. You can upgrade any time if you'd
          like unlimited access.
        </p>
        <hr style="border: none; border-top: 1px solid #fde68a; margin: 24px 0;" />
        <p style="color: #a8a29e; font-size: 12px; line-height: 1.5;">
          Shared Leash · <a href="${appUrl}" style="color: #a8a29e;">sharedleash.com</a><br />
          Questions? Reach us at <a href="mailto:support@sharedleash.com" style="color: #a8a29e;">support@sharedleash.com</a><br />
          You received this email because you created a Shared Leash account.
          You won't receive marketing emails unless you opt in.
        </p>
      </div>
    `,
  });
}
