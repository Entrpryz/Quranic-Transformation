/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Adapt to Next.js 15+ convention
) {
  try {
     // @ts-ignore
    const id = (await params).id;
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        resources: {
          where: { type: "PDF" },
          select: { url: true },
          take: 1,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const pdfResource = lesson.resources[0];

    if (!pdfResource) {
      return NextResponse.json({ error: "PDF resource not found" }, { status: 404 });
    }

    return NextResponse.json({ url: pdfResource.url });
  } catch (error) {
    console.error("Error fetching PDF URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDF URL" },
      { status: 500 }
    );
  }
}
