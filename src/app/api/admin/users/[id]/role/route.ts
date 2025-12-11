import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { UserRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  const { id } = await params; // Await params

  try {
    const { role } = await req.json();

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Security Check: Cannot modify another Admin
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ADMIN" && targetUser.id !== session.userId) {
       // Allow self-demotion? Probably safer to block modifying any admin other than potentially self (but usually blocked too).
       // User requirement: "I can only change their role not of any other admin"
       return NextResponse.json({ error: "Cannot modify another Admin" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Role Error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
