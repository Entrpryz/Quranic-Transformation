import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // 1. Exchange Code for Tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) throw new Error(tokenData.error_description);

    // 2. Fetch User Profile
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userResponse.json();

    if (!googleUser.email) throw new Error("No email found from Google");

    // 3. Find or Create User
    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        name: googleUser.name,
        image: googleUser.picture,
        emailVerified: new Date(), // Google emails are verified
        lastLogin: new Date(),
      },
      create: {
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.picture,
        emailVerified: new Date(),
        xp: 0,
        currentStreak: 0,
      },
    });

    // 4. Create Session & Cookie
    const sessionToken = await encrypt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
    return NextResponse.redirect(new URL("/dashboard", baseUrl));

  } catch (error) {
    console.error("Google Auth Error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
    return NextResponse.redirect(new URL("/auth/login?error=GoogleAuthFailed", baseUrl));
  }
}