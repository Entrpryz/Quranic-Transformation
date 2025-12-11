/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params are async in Next.js 15+ (if using recent) or standard object. Assuming standard pattern but `params` type in route handlers can be tricky. Let's use standard convention. 
  // Actually, recent Next.js versions (15) make params a Promise. I'll stick to safe pattern or assume standard awaiting if needed. 
  // Let's assume standard Next.js 13/14 pattern for now: params: { id: string }
) {
  // Awaiting params just in case this is Next.js 15, or treating as object if 14. 
  // To be safe I will cast or treat `params` carefully. 
  // Actually, standard signature usually works: 
  // Context: { params: { id: string } }
  
  try {
    // Handling potential async params
    // @ts-ignore
    const id = (await params).id; 

    // Id is string in url, but Int in DB (schema says Int for Lesson ID)
    const lessonId = parseInt(id);

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const session = await getSession();
    const isAdmin = session?.role === "ADMIN";

    if (lesson.minRole === "ADMIN" && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
