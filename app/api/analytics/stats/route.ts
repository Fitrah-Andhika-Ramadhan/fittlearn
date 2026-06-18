import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total Views
    const totalViews = await prisma.pageVisit.count();

    // Unique Visitors (count distinct IPs)
    const uniqueVisitorsResult = await prisma.pageVisit.findMany({
      distinct: ['ip'],
      select: {
        ip: true,
      },
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // Recent Visitors (latest 10)
    const recentVisitors = await prisma.pageVisit.findMany({
      orderBy: {
        visitedAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      recentVisitors,
    });
  } catch (error) {
    console.error("Failed to fetch analytics stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
