import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  let connection;
  try {
    const { name, description, price, category, image_url, restaurant_location } = await request.json();
    
    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    // Validate price is a number
    if (isNaN(Number(price))) {
      return NextResponse.json(
        { error: "Price must be a valid number" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      const id = uuidv4();
      console.log("Creating menu item with ID:", id);

      await connection.query(
        `INSERT INTO Menu (id, name, description, price, category, image_url, restaurant_location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, name, description, price, category, image_url, restaurant_location]
      );

      await connection.commit();
      console.log("Menu item created successfully");

      return NextResponse.json({ 
        success: true, 
        id,
        message: "Menu item created successfully"
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return NextResponse.json(
      { 
        error: "Failed to create menu item",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
} 