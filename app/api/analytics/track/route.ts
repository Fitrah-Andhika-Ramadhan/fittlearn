import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UAParser } from "ua-parser-js";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const headersList = await headers();
    const userAgentStr = headersList.get("user-agent") || "";
    let ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown";
    
    // In some environments, x-forwarded-for can be a comma-separated list of IPs
    if (ip && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Parse User Agent
    const parser = new UAParser(userAgentStr);
    const result = parser.getResult();

    const deviceType = result.device.type === "mobile" 
      ? "Mobile" 
      : result.device.type === "tablet" 
        ? "Tablet" 
        : "Desktop";
        
    const browserName = result.browser.name || "Unknown Browser";
    const osName = result.os.name || "Unknown OS";

    // Create tracking record
    await prisma.pageVisit.create({
      data: {
        path,
        ip,
        device: deviceType,
        browser: browserName,
        os: osName,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
