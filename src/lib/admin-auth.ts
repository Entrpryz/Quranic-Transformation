/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from "@/lib/session";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function requireAdmin(): Promise<{
  error?: NextResponse;
  session?: any;
}> {
  const session = await getSession();

  if (!session || !session.userId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.role !== UserRole.ADMIN) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { session };
}
