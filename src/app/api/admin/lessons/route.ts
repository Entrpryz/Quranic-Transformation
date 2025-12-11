import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { UserRole } from "@prisma/client";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { title, part, minRole, ...otherData } = body;

    if (!title || !part) {
      return NextResponse.json({ error: "Title and Part are required" }, { status: 400 });
    }

    const newLesson = await prisma.lesson.create({
        data: {
            title,
            part,
            minRole: minRole || UserRole.USER,
            ...otherData
        }
    });

    return NextResponse.json({ success: true, lesson: newLesson });
  } catch (error) {
    console.error("Create Lesson Error:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
