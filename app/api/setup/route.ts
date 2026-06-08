import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = 'fitrahramadhan310@gmail.com';
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      const password_hash = await bcrypt.hash('admin123', 10);
      user = await prisma.user.create({
        data: {
          name: 'Fitrah Andhika Ramadhan',
          email,
          password_hash,
        }
      });
      return NextResponse.json({ 
        success: true,
        message: "Admin user created successfully! You can now login.",
        email: email
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Admin user already exists in this database.",
      email: email
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
