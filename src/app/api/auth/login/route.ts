import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import * as z from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
    }

    const { email, password } = result.data;

    // 1. Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. Verify Password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Check if User is Banned
    const bannedUser = await prisma.bannedUser.findUnique({
      where: { email: user.email },
    });

    if (bannedUser) {
      return NextResponse.json(
        { error: "Your account has been banned." },
        { status: 403 }
      );
    }

    // 4. Check Email Verification (Optional but recommended)
    if (!user.emailVerified) {
       return NextResponse.json({ error: "Please verify your email first" }, { status: 403 });
    }

    // 4. Create Session Data
    // We only store essential info in the JWT to keep it small
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      xp: user.xp,
    };

    // 5. Generate JWT
    const token = await encrypt(sessionData);
    console.log("Login: Generated Token (first 20 chars):", token.substring(0, 20));

    // 6. Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    });

    return NextResponse.json(
      { success: true, message: "Logged in successfully", user: sessionData },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}