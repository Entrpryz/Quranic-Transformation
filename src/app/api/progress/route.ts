/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: parseInt(lessonId),
        },
      },
      update: {
        lastAccessedAt: new Date(),
      },
      create: {
        userId: session.id,
        lessonId: parseInt(lessonId),
        lastAccessedAt: new Date(),
        lastPlayed: 0,
        isCompleted: false,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.userProgress.findMany({
      where: {
        userId: session.id,
      },
      orderBy: {
        lastAccessedAt: "desc",
      },
      include: {
        lesson: {
          select: {
            title: true,
            part: true,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
