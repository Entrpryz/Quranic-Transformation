import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // 1. Find the token in the database
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Token does not exist!" }, { status: 404 });
    }

    // 2. Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
    }

    // 3. Find the user associated with this token
    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist!" }, { status: 404 });
    }

    // 4. Update the User (Verify them) AND update their email if it changed
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
        email: existingToken.email, // Updates email if this was a "Change Email" flow
      },
    });

    // 5. Delete the token so it can't be reused
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}