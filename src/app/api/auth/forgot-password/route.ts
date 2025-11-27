import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import * as z from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";

// Validation Schema
const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const result = ForgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email } = result.data;

    // 2. Find User
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Handle Non-Existent User
    // SECURITY TIP: We return 200 OK even if the user doesn't exist.
    // This prevents malicious actors from checking which emails are registered ("Email Enumeration").
    if (!existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: "If an account exists, a reset email has been sent." 
      });
    }

    // 4. Generate Token & Send Email
    // (This uses the utility functions we created in the Register step)
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return NextResponse.json({ 
      success: true, 
      message: "Reset email sent." 
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}