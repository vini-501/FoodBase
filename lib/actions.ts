"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { placeOrder as dbPlaceOrder } from "./db";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "./db"; // Adjust the import based on your project structure

interface UserData {
  username: string;
  email: string;
  phone: string;
}

interface OrderData {
  userId: number;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  restaurantName: string;
  deliveryCharges: number;
  paymentMethod: string;
  totalAmount: number;
  status: string;
}

// Helper function to generate a unique ID
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export async function loginUser(userData: UserData) {
  try {
    // Create a user object with a generated ID
    const userId = uuidv4(); // Use UUID instead of timestamp
    const user = {
      id: userId,
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      created_at: new Date().toISOString(),
    };

    // Save user to database
    const db = await connectDB();
    await db.query(
      `INSERT INTO Users (id, username, email, phone) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE username=?, phone=?`,
      [userId, user.username, user.email, user.phone, user.username, user.phone]
    );

    // Set a cookie to maintain session
    const cookieStore = await cookies();
    cookieStore.set("user_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, userId };
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Failed to login");
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  revalidatePath("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_session");
  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value);
  } catch (error) {
    return null;
  }
}

export async function placeOrder(orderData: OrderData) {
  try {
    // Validate critical data first
    if (!orderData.userId) {
      throw new Error("User ID is required");
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error("Order must include at least one item");
    }

    if (!orderData.deliveryAddress) {
      throw new Error("Delivery address is required");
    }

    // Ensure total amount is not null or undefined
    let totalAmount = orderData.totalAmount || 0;

    // Calculate total from items if totalAmount is missing
    if (!totalAmount && orderData.items.length > 0) {
      totalAmount = orderData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    console.log("Placing order with data:", {
      userId: orderData.userId.toString(),
      total: totalAmount,
      itemsCount: orderData.items.length,
      deliveryAddress: orderData.deliveryAddress
    });

    return await dbPlaceOrder({
      userId: orderData.userId.toString(),
      total: totalAmount,
      items: orderData.items.map((item) => ({
        id: item.id.toString(),
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress: orderData.deliveryAddress
    });
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error(
      "Failed to place order: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
