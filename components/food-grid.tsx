"use client";

import { useState, useEffect } from "react";
import { FoodCard } from "./food-card";
import { useToast } from "@/components/ui/use-toast";

interface MenuItem {
  id: string;
  image: string;
  title: string;
  price: number;
  discount?: number;
  type: "Veg" | "Non Veg";
  category: string;
}

const southIndianFoods: MenuItem[] = [
  {
    id: "menu-1",
    image: "/imgg1.avif?height=200&width=300",
    title: "Open Butter Masala Dosa",
    price: 80,
    type: "Veg",
    category: "Breakfast",
  },
  {
    id: "menu-2",
    image: "/imgg2.jpeg?height=200&width=300",
    title: "Ghee Pudi Idli with Coconut Chutney",
    price: 60,
    discount: 10,
    type: "Veg",
    category: "Breakfast",
  },
  {
    id: "menu-3",
    image: "/img3.webp?height=200&width=300",
    title: "Mini Vada with Sambar",
    price: 40,
    type: "Veg",
    category: "Breakfast",
  },
  {
    id: "menu-4",
    image: "/imgg4.jpg?height=160&width=300",
    title: "Pulav and Raitha",
    price: 70,
    type: "Veg",
    category: "Main Course",
  },
  {
    id: "menu-5",
    image: "/img5.jpg?height=160&width=300",
    title: "Hyderabadi Chicken Biryani",
    price: 150,
    type: "Non Veg",
    category: "Main Course",
  },
  {
    id: "menu-6",
    image: "/img6.jpeg?height=160&width=300",
    title: "Filter Coffee",
    price: 25,
    discount: 15,
    type: "Veg",
    category: "Beverages",
  },
  {
    id: "menu-7",
    image: "/puri.webp?height=160&width=300",
    title: "Puri with Sagu",
    price: 60,
    type: "Veg",
    category: "Soups",
  },
  {
    id: "menu-8",
    image: "/imgg8.jpeg?height=160&width=300",
    title: "Curd Rice",
    price: 40,
    type: "Veg",
    category: "Main Course",
  },
  {
    id: "menu-9",
    image: "/imgg9.webp?height=160&width=300",
    title: "Mysore Pak",
    price: 50,
    type: "Veg",
    category: "Desserts",
  },
  {
    id: "menu-10",
    image: "/imgg10.jpg?height=160&width=300",
    title: "Pongal with Coconut Chutney",
    price: 80,
    type: "Veg",
    category: "Breakfast",
  },
  {
    id: "menu-11",
    image: "/imgg11.jpg?height=160&width=300",
    title: "Palak Panner",
    price: 170,
    type: "Veg",
    category: "Main Course",
  },
  {
    id: "menu-12",
    image: "/img12.jpg?height=160&width=300",
    title: "Bisi Bele Bath  ",
    price: 60,
    type: "Veg",
    category: "Main Course",
  },
];

export function FoodGrid() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);

  const addToCart = (item: MenuItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      // Update quantity if item exists
      const updatedItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: (cartItem as any).quantity + 1 }
          : cartItem
      );
      setCartItems(updatedItems);

      // Update cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    } else {
      // Add new item to cart
      const newItem = { ...item, quantity: 1 };
      const newCartItems = [...cartItems, newItem];
      setCartItems(newCartItems);

      // Update cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }

    toast({
      title: "Added to cart",
      description: `${item.title} has been added to your cart.`,
      duration: 2000,
    });

    // Dispatch custom event for cart component to listen
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {southIndianFoods.map((item) => (
        <FoodCard key={item.id} {...item} onAddToCart={() => addToCart(item)} />
      ))}
    </div>
  );
}
