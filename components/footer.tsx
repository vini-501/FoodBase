"use client"

import { useState, useEffect } from "react"

interface Order {
  table: string
  items: number
  kitchen: string
  status?: string
}

export function Footer() {
  const [orders, setOrders] = useState<Order[]>([
    { table: "T1", items: 6, kitchen: "Kitchen", status: "Process" },
    { table: "T2", items: 4, kitchen: "Kitchen" },
    { table: "T3", items: 3, kitchen: "Kitchen" },
  ])

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of a new order
      if (Math.random() < 0.1) {
        const tableNum = Math.floor(Math.random() * 8) + 1
        const itemCount = Math.floor(Math.random() * 5) + 1

        // Check if this table already has an order
        if (!orders.some((order) => order.table === `T${tableNum}`)) {
          setOrders((prev) => [
            ...prev,
            {
              table: `T${tableNum}`,
              items: itemCount,
              kitchen: "Kitchen",
              status: Math.random() > 0.7 ? "Process" : undefined,
            },
          ])
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [orders])

  return (
    <div className="bg-white border-t p-4 flex gap-4 overflow-x-auto">
      {orders.map((order, index) => (
        <div key={index} className="flex items-center gap-3 bg-orange-50 rounded-lg p-3 flex-1 min-w-[200px]">
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
            {order.table}
          </div>
          <div>
            <div className="text-sm font-medium">
              {order.items} Items → {order.kitchen}
            </div>
            {order.status && <div className="text-xs text-orange-600">{order.status}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
