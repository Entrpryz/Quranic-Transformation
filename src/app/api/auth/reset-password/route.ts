import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is missing"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate Input
    const result = ResetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { token, password } = result.data;

    // 2. Find the Token in DB
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token!" }, { status: 400 });
    }

    // 3. Check Expiry
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
    }

    // 4. Find User associated with token
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User does not exist!" }, { status: 404 });
    }

    // 5. Hash New Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Transaction: Update Password AND Delete Token
    // Doing this in a transaction ensures the token isn't deleted if the password update fails
    await prisma.$transaction([
      prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully!" 
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}