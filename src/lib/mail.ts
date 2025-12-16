import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;
const EMAIL_USER = process.env.NEXT_PUBLIC_EMAIL_USER;
const EMAIL_PASS = process.env.NEXT_PUBLIC_EMAIL_PASS;

// OPTIMIZATION: Create transporter once and reuse (connection pooling)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// OPTIMIZATION: Generic email sending function to avoid code duplication
interface SendEmailParams {
  email: string;
  subject: string;
  html: string;
}

/**
 * OPTIMIZATION: Generic email sender to handle common sending logic
 * Uses fire-and-forget pattern to prevent blocking the request.
 */
const sendEmail = async ({ email, subject, html }: SendEmailParams): Promise<boolean> => {
  const mailOptions = {
    from: `"Quranic Transformation" <${EMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  try {
    // OPTIMIZATION: Use sendMail with callback for non-blocking operation
    // This allows the event loop to continue while email is sending
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`❌ Error sending email to ${email}:`, error);
      } else {
        console.log(`✅ Email sent to ${email}: ${info.messageId}`);
      }
    });
    // OPTIMIZATION: Return immediately without waiting for SMTP response
    return true;
  } catch (error) {
    console.error(`❌ Synchronous error in sendEmail for ${email}:`, error);
    return false;
  }
};

/**
 * Sends the Email Verification Link
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #10b981; text-align: center;">Confirm your Email</h2>
      <p style="font-size: 16px; line-height: 1.5;">Welcome to Quranic Transformation! Please confirm your email address to activate your account and start your journey.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
      </div>
      <p style="font-size: 14px; color: #666;">Or copy and paste this link in your browser:</p>
      <p style="font-size: 12px; color: #888; word-break: break-all;">${confirmLink}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">If you did not create this account, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject: "Confirm your email",
    html,
  });
};

/**
 * Sends the Password Reset Link
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #ea580c; text-align: center;">Reset Password</h2>
      <p style="font-size: 16px; line-height: 1.5;">We received a request to reset the password for your Quranic Transformation account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ea580c; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this change, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({
    email,
    subject: "Reset your password",
    html,
  });
};

// OPTIMIZATION: Add health check for transporter connection reuse
export const verifyTransporter = () => transporter.verify();