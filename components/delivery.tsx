"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, CheckCircle, Truck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DeliveryOrder {
  id: number
  customer: string
  address: string
  phone: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "preparing" | "out-for-delivery" | "delivered" | "cancelled"
  time: string
  deliveryPerson?: string
}

export function Delivery() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: 1001,
      customer: "Rahul Mehta",
      address: "123 Gandhi Road, Chennai",
      phone: "9876543210",
      items: [
        { name: "Masala Dosa", quantity: 2, price: 8.99 },
        { name: "Filter Coffee", quantity: 2, price: 2.99 },
      ],
      total: 23.96,
      status: "pending",
      time: "10:30 AM",
    },
    {
      id: 1002,
      customer: "Sneha Patel",
      address: "456 Nehru Street, Chennai",
      phone: "8765432109",
      items: [
        { name: "Idli Sambar", quantity: 1, price: 6.99 },
        { name: "Chettinad Chicken Curry", quantity: 1, price: 12.99 },
      ],
      total: 19.98,
      status: "preparing",
      time: "11:15 AM",
    },
    {
      id: 1003,
      customer: "Karthik Rajan",
      address: "789 Marina Beach Road, Chennai",
      phone: "7654321098",
      items: [
        { name: "Hyderabadi Biryani", quantity: 1, price: 14.99 },
        { name: "Rasam", quantity: 1, price: 4.99 },
        { name: "Gulab Jamun", quantity: 2, price: 5.99 },
      ],
      total: 31.96,
      status: "out-for-delivery",
      time: "12:00 PM",
      deliveryPerson: "Vijay",
    },
    {
      id: 1004,
      customer: "Ananya Krishnan",
      address: "234 Temple Street, Chennai",
      phone: "6543210987",
      items: [
        { name: "Appam with Vegetable Stew", quantity: 2, price: 9.99 },
        { name: "Mango Lassi", quantity: 2, price: 3.99 },
      ],
      total: 27.96,
      status: "delivered",
      time: "9:45 AM",
      deliveryPerson: "Ravi",
    },
  ])

  const updateOrderStatus = (id: number, status: DeliveryOrder["status"], deliveryPerson?: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status, deliveryPerson: deliveryPerson || order.deliveryPerson } : order,
    )
    setOrders(updatedOrders)

    toast({
      title: `Order #${id} updated`,
      description: `Order status changed to ${status}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Preparing
          </Badge>
        )
      case "out-for-delivery":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Out for Delivery
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  const deliveryPersonnel = ["Ravi", "Vijay", "Sundar", "Priya", "Deepak"]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className={`p-4 ${getStatusColor(order.status)}`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Order #{order.id}</h3>
                {getStatusBadge(order.status)}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Details</h4>
                  <div className="space-y-2">
                    <p className="text-sm">{order.customer}</p>
                    <p className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {order.address}
                    </p>
                    <p className="text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      {order.phone}
                    </p>
                    <p className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {order.time}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.deliveryPerson && (
                <div className="mb-4 p-2 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Delivery Person: {order.deliveryPerson}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                    >
                      Start Preparing
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                      Cancel Order
                    </Button>
                  </>
                )}

                {order.status === "preparing" && (
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex gap-2">
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        onChange={(e) => {
                          if (e.target.value) {
                            updateOrderStatus(order.id, "out-for-delivery", e.target.value)
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select delivery person
                        </option>
                        {deliveryPersonnel.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          if (order.deliveryPerson) {
                            updateOrderStatus(order.id, "out-for-delivery")
                          } else {
                            toast({
                              title: "Select delivery person",
                              description: "Please select a delivery person first",
                              variant: "destructive",
                            })
                          }
                        }}
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Send for Delivery
                      </Button>
                    </div>
                  </div>
                )}

                {order.status === "out-for-delivery" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => updateOrderStatus(order.id, "delivered")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Delivered
                  </Button>
                )}

                {(order.status === "delivered" || order.status === "cancelled") && (
                  <p className="text-sm text-gray-500">
                    {order.status === "delivered" ? "This order has been delivered." : "This order has been cancelled."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
