import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { lessonId, title, url, type } = body;

    if (!lessonId || !title || !url) {
      return NextResponse.json(
        { error: "Lesson ID, Title, and URL are required" },
        { status: 400 }
      );
    }

    const newResource = await prisma.resource.create({
      data: {
        lessonId: parseInt(lessonId),
        title,
        url,
        type: type || "LINK",
      },
    });

    return NextResponse.json({ success: true, resource: newResource });
  } catch (error) {
    console.error("Create Resource Error:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}