import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

const transporter = nodemailer.createTransport({
     service: "gmail", // Or use 'host' and 'port' for other providers
     auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
     },
});

export const sendVerificationEmail = async (email: string, token: string) => {
     const confirmLink = `${domain}/auth/new-verification?token=${token}`;

     const mailOptions = {
          from: `"Quranic Transformation" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Confirm your email",
          html: `
               <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
               <h1 style="color: #10b981;">Confirm your Email</h1>
               <p>Welcome to Quranic Transformation! Please confirm your email to start your journey.</p>
               <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to confirm</a>
               <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not create this account, please ignore this email.</p>
               </div>
          `,
     };

     try {
          await transporter.sendMail(mailOptions);
          console.log("✅ Verification email sent to:", email);
     } catch (error) {
          console.error("❌ Error sending verification email:", error);
     }
};