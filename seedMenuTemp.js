const mysql = require('mysql2/promise');
require('dotenv').config();

const menuData = [
  {
    id: "menu-1",
    name: "Masala Dosa",
    description: "Crispy dosa filled with spiced potato filling and served with sambar and chutney",
    price: 120,
    category: "Breakfast",
    image_url: "/imgg1.avif?height=160&width=300",
    restaurant_location: "The Rameshwaram Cafe - 32, Gandhi Bazaar Main Road, Basavanagudi, Bangalore"
  },
  {
    id: "menu-2",
    name: "Idli Vada Combo",
    description: "Steamed rice cakes and crispy vadas served with sambar and coconut chutney",
    price: 100,
    category: "Breakfast",
    image_url: "/imgg2.jpeg?height=160&width=300",
    restaurant_location: "Central Tiffin Room (CTR/Sri Sagar) - 7th Cross, Margosa Road, Malleshwaram, Bangalore"
  },
  {
    id: "menu-3",
    name: "Pongal with Sambar",
    description: "Creamy rice and lentil dish seasoned with black pepper and cumin, served with sambar",
    price: 90,
    category: "Breakfast",
    image_url: "/img3.webp?height=160&width=300",
    restaurant_location: "Koshy's - 39, St. Mark's Road, Bangalore"
  },
  {
    id: "menu-4",
    name: "Veg Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
    price: 180,
    category: "Main Course",
    image_url: "/imgg4.jpeg?height=160&width=300",
    restaurant_location: "Toit Brewpub - 298, 100 Feet Road, Indiranagar, Bangalore"
  },
  {
    id: "menu-5",
    name: "Chicken Biryani",
    description: "Hyderabadi style biryani with tender chicken pieces and aromatic spices",
    price: 220,
    category: "Main Course",
    image_url: "/img5.jpg?height=160&width=300",
    restaurant_location: "The Rameshwaram Café - 252, 36th Cross, 9th Main, 5th Block, Jayanagar, Bangalore"
  },
  {
    id: "menu-6",
    name: "Filter Coffee",
    description: "Traditional South Indian filter coffee with frothy milk and rich aroma",
    price: 40,
    category: "Beverages",
    image_url: "/img6.jpeg?height=160&width=300",
    restaurant_location: "Karavalli - The Gateway Hotel, 66, Residency Road, Ashok Nagar, Bangalore"
  },
  {
    id: "menu-7",
    name: "Puri Bhaji",
    description: "Fluffy puris served with spicy potato curry and accompaniments",
    price: 100,
    category: "Main Course",
    image_url: "/puri.webp?height=160&width=300",
    restaurant_location: "Nagarjuna - 44/1, Residency Road, Bangalore"
  },
  {
    id: "menu-8",
    name: "Curd Rice",
    description: "Creamy rice mixed with yogurt, tempered with mustard seeds and curry leaves",
    price: 80,
    category: "Main Course",
    image_url: "/imgg8.jpeg?height=160&width=300",
    restaurant_location: "Sharief Bhai - Koramangala Branch, Bangalore"
  },
  {
    id: "menu-9",
    name: "Mysore Pak",
    description: "Traditional sweet made with gram flour, ghee and sugar, rich and melt-in-mouth",
    price: 60,
    category: "Desserts",
    image_url: "/imgg9.webp?height=160&width=300",
    restaurant_location: "Jamavar - The Leela Palace, 23, Old Airport Road, Bangalore"
  },
  {
    id: "menu-10",
    name: "Rava Idli",
    description: "Soft and fluffy semolina idlis served with sambar and chutney",
    price: 90,
    category: "Breakfast",
    image_url: "/imgg10.jpg?height=160&width=300",
    restaurant_location: "MTR (Mavalli Tiffin Room) - 14, Lalbagh Road, Bangalore"
  },
  {
    id: "menu-11",
    name: "Palak Paneer",
    description: "Cottage cheese cubes in a creamy spinach gravy with aromatic spices",
    price: 200,
    category: "Main Course",
    image_url: "/imgg11.jpg?height=160&width=300",
    restaurant_location: "Sankalp Restaurant- 1st Floor, Ashoka Nagar, Bangalore"
  },
  {
    id: "menu-12",
    name: "Bisi Bele Bath",
    description: "Spicy rice dish with lentils, vegetables and special spice mix",
    price: 150,
    category: "Main Course",
    image_url: "/img12.jpg?height=160&width=300",
    restaurant_location: "Vidyarthi Bhavan - 32, Gandhi Bazaar Main Road, Basavanagudi, Bangalore"
  }
];

async function seedMenu() {
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

  try {
    // Check if restaurant_location column exists
    const [columns] = await pool.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Menu' AND COLUMN_NAME = 'restaurant_location'`);
    if (!Array.isArray(columns) || columns.length === 0) {
      await pool.query(`ALTER TABLE Menu ADD COLUMN restaurant_location TEXT NOT NULL`);
      console.log('Added restaurant_location column to Menu table.');
    }
    // Delete from dependent tables first due to foreign key constraints
    await pool.query('DELETE FROM Delivery');
    await pool.query('DELETE FROM OrderItems');
    await pool.query('DELETE FROM Orders');
    await pool.query('DELETE FROM Menu');
    for (const item of menuData) {
      await pool.query(
        `INSERT INTO Menu (id, name, description, price, category, image_url, restaurant_location)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          item.description,
          item.price,
          item.category,
          item.image_url,
          item.restaurant_location
        ]
      );
    }
    console.log('Menu table seeded with 12 items!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seedMenu(); 