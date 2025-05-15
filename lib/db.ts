import { id } from "date-fns/locale";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL");
    connection.release();
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

export async function createTables() {
  try {
    const db = await connectDB();

    // Create Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Menu table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Menu (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url TEXT,
        restaurant_location TEXT NOT NULL,  /* Add this column */
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);

    // Create OrderItems table
    await db.query(`
      CREATE TABLE IF NOT EXISTS OrderItems (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        menu_id VARCHAR(50),
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES Orders(id),
        FOREIGN KEY (menu_id) REFERENCES Menu(id)
      )
    `);

    // Create Delivery table
    await db.query(`
      CREATE TABLE IF NOT EXISTS Delivery (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        menu_id VARCHAR(50) NOT NULL,
        quantity INT NOT NULL,
        delivery_location TEXT NOT NULL,
        pickup_location TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES Orders(id),
        FOREIGN KEY (menu_id) REFERENCES Menu(id)
      )
    `);

    console.log("Database tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  }
}

export async function placeOrder(orderData: {
  userId: string;
  total: number;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
}) {
  let connection;
  try {
    const db = await connectDB();
    connection = await db.getConnection();

    // Start transaction
    await connection.beginTransaction();

    // Check if user exists
    const [userRows] = await connection.query(
      "SELECT id FROM Users WHERE id = ?",
      [orderData.userId]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
      throw new Error("User not found. Please login again.");
    }

    // Modified to only query columns that exist
    let existingMenuItems: { id: string; restaurant_location: string }[] = [];
    for (const item of orderData.items) {
      const [rows] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT id FROM Menu WHERE id = ?",
        [item.id]
      );

      if (Array.isArray(rows) && rows.length > 0 && rows[0].id) {
        existingMenuItems.push({
          id: rows[0].id,
          restaurant_location: "Default Restaurant Location", // Add default value
        });
      }
    }

    // Get IDs from result
    const existingIds = existingMenuItems.map((item) => item.id);
    console.log("Existing menu IDs found:", existingIds);

    const validItems = orderData.items.filter((item) =>
      existingIds.includes(item.id)
    );

    if (validItems.length === 0) {
      throw new Error("None of the menu items exist in the database");
    }

    // Create order
    const orderId = uuidv4();
    await connection.query(
      `INSERT INTO Orders (id, user_id, total_amount, status)
       VALUES (?, ?, ?, ?)`,
      [orderId, orderData.userId, orderData.total, "pending"]
    );

    // Insert validated items and create delivery records
    for (const item of validItems) {
      // Find the menu item to get its restaurant location
      const menuItem = existingMenuItems.find((mi) => mi.id === item.id);
      if (!menuItem) continue;

      // Insert order item
      const orderItemId = uuidv4();
      await connection.query(
        `INSERT INTO OrderItems (id, order_id, menu_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderItemId, orderId, item.id, item.quantity, item.price]
      );

      // Create delivery record
      const deliveryId = uuidv4();
      await connection.query(
        `INSERT INTO Delivery (id, order_id, menu_id, quantity, delivery_location, pickup_location, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          deliveryId,
          orderId,
          item.id,
          item.quantity,
          orderData.deliveryAddress,
          menuItem.restaurant_location,
          "pending",
        ]
      );
    }

    // Commit transaction
    await connection.commit();

    return {
      success: true,
      orderId: orderId,
    };
  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error("Error in placeOrder:", error);
    throw error;
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Initializes the database connection and performs
 * any necessary setup operations before application start
 */
export async function initializeDatabase() {
  try {
    console.log("Initializing database connection...");

    // Get database connection
    const db = await connectDB();

    // Check database connection
    const [result] = await db.query("SELECT 1 as connection_test");
    if (result) {
      console.log("Database connection successful");
    }

    // Create tables if they don't exist
    await createTables();

    // Alter Menu table if needed
    await alterMenuTable();

    // Seed menu data if needed
    await seedMenuData();

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

/**
 * Clears all menu items from the database
 */
export async function clearMenuItems() {
  try {
    const db = await connectDB();
    await db.query("DELETE FROM Menu");
    console.log("Menu items cleared from database");
  } catch (error) {
    console.error("Error clearing menu items:", error);
    throw error;
  }
}

/**
 * Seeds the database with initial menu items if none exist
 */
export async function seedMenuData() {
  try {
    const db = await connectDB();

    // Clear existing menu items
    await clearMenuItems();
    console.log("Seeding menu items...");

    // Sample South Indian dishes with FIXED IDs and restaurant locations
    const menuData = [
      {
        id: "menu-1",
        name: "Open Butter Masala Dosa",
        description: "Crispy dosa filled with spiced potato filling and butter",
        price: 80,
        category: "Breakfast",
        image_url: "/imgg1.avif?height=160&width=300",
        restaurant_location:
          "The Rameshwaram Cafe - 32, Gandhi Bazaar Main Road, Basavanagudi, Bangalore",
      },
      {
        id: "menu-2",
        name: "Ghee Pudi Idli with Coconut Chutney",
        description: "Steamed rice cakes served with lentil soup",
        price: 60,
        category: "Breakfast",
        image_url: "/imgg2.jpeg?height=160&width=300",
        restaurant_location:
          "Central Tiffin Room (CTR/Sri Sagar) - 7th Cross, Margosa Road, Malleshwaram, Bangalore",
      },
      {
        id: "menu-3",
        name: "Mini Vada with Sambar",
        description: "Crispy savory donut made from lentil batter",
        price: 40,
        category: "Breakfast",
        image_url: "/img3.webp?height=160&width=300",
        restaurant_location: "Koshy's - 39, St. Mark's Road, Bangalore",
      },
      {
        id: "menu-4",
        name: "Pulav and Raitha",
        description: "Spicy pulav rice with flavourful spices and raitha",
        price: 70,
        category: "Main Course",
        image_url: "/imgg4.jpeg?height=160&width=300",
        restaurant_location:
          "Toit Brewpub - 298, 100 Feet Road, Indiranagar, Bangalore",
      },
      {
        id: "menu-5",
        name: "Hyderabadi Chicken Biryani",
        description: "Fragrant rice dish with spices and chicken",
        price: 150,
        category: "Main Course",
        image_url: "/img5.jpg?height=160&width=300",
        restaurant_location:
          "The Rameshwaram Café - 252, 36th Cross, 9th Main, 5th Block, Jayanagar, Bangalore",
      },
      {
        id: "menu-6",
        name: "Filter Coffee",
        description: "Traditional South Indian coffee with frothy milk",
        price: 25,
        category: "Beverages",
        image_url: "/img6.jpeg?height=160&width=300",
        restaurant_location:
          "Karavalli - The Gateway Hotel, 66, Residency Road, Ashok Nagar, Bangalore",
      },
      {
        id: "menu-7",
        name: "Puri with Sagu",
        description: "Puri served with spicy potato curry",
        price: 4.99,
        category: "Main Course",
        image_url: "/puri.webp?height=160&width=300",
        restaurant_location: "Nagarjuna - 44/1, Residency Road, Bangalore",
      },
      {
        id: "menu-8",
        name: "Curd Rice",
        description: "Curd rice served with pickles and papad",
        price: 40,
        category: "Main Course",
        image_url: "/imgg8.jpeg?height=160&width=300",
        restaurant_location: "Sharief Bhai - Koramangala Branch, Bangalore",
      },
      {
        id: "menu-9",
        name: "Mysore Pak",
        description: "Traditional sweet made with gram flour, ghee and sugar",
        price: 50,
        category: "Desserts",
        image_url: "/imgg9.webp?height=160&width=300",
        restaurant_location:
          "Jamavar - The Leela Palace, 23, Old Airport Road, Bangalore",
      },
      {
        id: "menu-10",
        name: "Pongal with Coconut Chutney",
        description: "Savory rice and lentil dish, seasoned with spices",
        price: 80,
        category: "Breakfast",
        image_url: "/imgg10.jpg?height=160&width=300",
        restaurant_location:
          "MTR (Mavalli Tiffin Room) - 14, Lalbagh Road, Bangalore",
      },
      {
        id: "menu-11",
        name: "Palak Panner",
        description: "Green palak served with  fresh panner",
        price: 170,
        category: "Breakfast",
        image_url: "/imgg11.jpg?height=160&width=300",
        restaurant_location:
          "Sankalp Restaurant- 1st Floor, Ashoka Nagar, Bangalore",
      },
      {
        id: "menu-12",
        name: "Bisi Bele Bath",
        description: "Spicy rice dish with lentils and vegetables",
        price: 60,
        category: "Main Course",
        image_url: "/img12.jpg?height=160&width=300",
        restaurant_location:
          "Vidyarthi Bhavan - 32, Gandhi Bazaar Main Road, Basavanagudi, Bangalore",
      },
    ];

    // Insert menu items
    for (const item of menuData) {
      await db.query(
        `INSERT INTO Menu (id, name, description, price, category, image_url, restaurant_location)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.description,
          item.price,
          item.category,
          item.image_url,
          item.restaurant_location,
        ]
      );
    }

    console.log(`Added ${menuData.length} menu items to database`);
    return menuData;
  } catch (error) {
    console.error("Error seeding menu data:", error);
    throw error;
  }
}

/**
 * Returns all menu items from database for display in the UI
 */
export async function getMenuItems() {
  try {
    const db = await connectDB();
    const [items] = await db.query(
      "SELECT * FROM Menu ORDER BY category, name"
    );

    console.log(
      `Retrieved ${Array.isArray(items) ? items.length : 0} menu items`
    );
    return items;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
}

/**
 * Gets a single menu item by ID
 */
export async function getMenuItemById(id: string) {
  try {
    const db = await connectDB();
    const [items] = await db.query("SELECT * FROM Menu WHERE id = ?", [id]);

    return Array.isArray(items) && items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    throw error;
  }
}

/**
 * Gets menu items by category
 */
export async function getMenuItemsByCategory(category: string) {
  try {
    const db = await connectDB();
    const [items] = await db.query(
      "SELECT * FROM Menu WHERE category = ? ORDER BY name",
      [category]
    );

    return items || [];
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    throw error;
  }
}

/**
 * Gets all menu categories
 */
export async function getMenuCategories() {
  try {
    const db = await connectDB();
    const [categories] = await db.query(
      "SELECT DISTINCT category FROM Menu ORDER BY category"
    );

    return categories || [];
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    throw error;
  }
}

export async function alterMenuTable() {
  try {
    const db = await connectDB();
    console.log("Altering Menu table to add restaurant_location column...");

    // First check if the column exists
    const [columns] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Menu' 
      AND COLUMN_NAME = 'restaurant_location'
    `);

    if (!Array.isArray(columns) || columns.length === 0) {
      // Add the restaurant_location column if it doesn't exist
      await db.query(`
        ALTER TABLE Menu 
        ADD COLUMN restaurant_location TEXT NOT NULL DEFAULT 'South Indian Delights, 123 Main Street, Chennai'
      `);
      console.log("Added restaurant_location column to Menu table");
    }

    // Also ensure image_url is TEXT type
    await db.query(`
      ALTER TABLE Menu 
      MODIFY COLUMN image_url TEXT
    `);

    console.log("Menu table alterations completed successfully");
  } catch (error) {
    console.error("Error altering Menu table:", error);
    throw error;
  }
}
