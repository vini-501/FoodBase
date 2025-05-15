"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FoodCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  discount?: number;
  type: "Veg" | "Non Veg";
  onAddToCart: () => void;
}

export function FoodCard({
  id,
  image,
  title,
  price,
  discount,
  type,
  onAddToCart,
}: FoodCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-40 md:h-52 lg:h-64 object-cover"
        />
        {discount && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
            {discount}% Off
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">₹{price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                type === "Veg" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-xs text-gray-500">{type}</span>
          </div>
        </div>
        <Button
          onClick={onAddToCart}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
