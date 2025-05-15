"use client"

import { useState } from "react"
import { Grid, Coffee, Soup, UtensilsCrossed, Wine, Cake } from "lucide-react"

const categories = [
  { icon: Grid, label: "All", items: "235 Items", active: true },
  { icon: Coffee, label: "Breakfast", items: "45 Items" },
  { icon: Soup, label: "Soups", items: "12 Items" },
  { icon: UtensilsCrossed, label: "Main Course", items: "38 Items" },
  { icon: Wine, label: "Beverages", items: "15 Items" },
  { icon: Cake, label: "Desserts", items: "20 Items" },
]

export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      {categories.map((category, index) => (
        <div
          key={index}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] ${
            activeCategory === category.label ? "bg-green-50 text-green-600" : "bg-white"
          } border cursor-pointer hover:bg-green-50`}
          onClick={() => setActiveCategory(category.label)}
        >
          <category.icon className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">{category.label}</span>
          <span className="text-xs text-gray-500">{category.items}</span>
        </div>
      ))}
    </div>
  )
}
