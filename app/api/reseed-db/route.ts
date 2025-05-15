import { seedMenuData } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const menuData = await seedMenuData();
    return NextResponse.json({ success: true, menuData });
  } catch (error) {
    console.error("Failed to reseed database:", error);
    return NextResponse.json(
      { error: "Failed to reseed database" },
      { status: 500 }
    );
  }
} 