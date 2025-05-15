import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, price, category, image_url } = await request.json();
    const db = await connectDB();

    await db.query(
      `UPDATE Menu 
       SET name = ?, description = ?, price = ?, category = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price, category, image_url, params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  console.log("Delete request received for ID:", params.id);
  
  try {
    if (!params.id) {
      console.log("No ID provided in delete request");
      return NextResponse.json(
        { error: "Menu item ID is required" },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    const db = await connectDB();
    connection = await db.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    try {
      // First check if the item exists
      console.log("Checking if menu item exists...");
      const [rows] = await connection.query("SELECT id FROM Menu WHERE id = ?", [params.id]);
      console.log("Query result:", rows);
      
      if (!Array.isArray(rows) || rows.length === 0) {
        console.log("Menu item not found");
        await connection.rollback();
        return NextResponse.json(
          { error: "Menu item not found" },
          { status: 404 }
        );
      }

      // Delete related order items first
      console.log("Deleting related order items...");
      await connection.query("DELETE FROM OrderItems WHERE menu_id = ?", [params.id]);

      // Delete the menu item
      console.log("Deleting menu item...");
      await connection.query("DELETE FROM Menu WHERE id = ?", [params.id]);
      
      // Commit transaction
      await connection.commit();
      console.log("Menu item deleted successfully");
      
      return NextResponse.json({ 
        success: true,
        message: "Menu item and related order items deleted successfully"
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Detailed error in DELETE endpoint:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete menu item",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      console.log("Releasing database connection");
      connection.release();
    }
  }
} 