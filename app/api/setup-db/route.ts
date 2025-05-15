import { getMenuItems } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch menu items:", error);
    return NextResponse.json(
      { error: "Failed to load menu items" },
      { status: 500 }
    );
  }
}
