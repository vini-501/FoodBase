"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Table {
  id: number
  number: string
  capacity: number
  status: "available" | "occupied" | "reserved"
  customer?: string
  time?: string
}

export function TableServices() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: "T1", capacity: 2, status: "available" },
    { id: 2, number: "T2", capacity: 4, status: "occupied", customer: "Raj Kumar", time: "12:30 PM" },
    { id: 3, number: "T3", capacity: 6, status: "reserved", customer: "Priya Singh", time: "1:45 PM" },
    { id: 4, number: "T4", capacity: 2, status: "available" },
    { id: 5, number: "T5", capacity: 8, status: "occupied", customer: "Anand Family", time: "2:15 PM" },
    { id: 6, number: "T6", capacity: 4, status: "available" },
    { id: 7, number: "T7", capacity: 2, status: "reserved", customer: "Meera Patel", time: "7:30 PM" },
    { id: 8, number: "T8", capacity: 6, status: "available" },
  ])

  const [customerName, setCustomerName] = useState("")
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [action, setAction] = useState<"reserve" | "occupy" | null>(null)

  const handleTableAction = (table: Table, actionType: "reserve" | "occupy") => {
    setSelectedTable(table)
    setAction(actionType)
  }

  const confirmAction = () => {
    if (!selectedTable || !action || !customerName) return

    const updatedTables = tables.map((table) => {
      if (table.id === selectedTable.id) {
        return {
          ...table,
          status: action === "reserve" ? "reserved" : "occupied",
          customer: customerName,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      }
      return table
    })

    setTables(updatedTables)
    setSelectedTable(null)
    setAction(null)
    setCustomerName("")
  }

  const releaseTable = (tableId: number) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          status: "available",
          customer: undefined,
          time: undefined,
        }
      }
      return table
    })

    setTables(updatedTables)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      default:
        return ""
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Table Management</h1>

      {selectedTable && action && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {action === "reserve" ? "Reserve" : "Occupy"} Table {selectedTable.number}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmAction} className="bg-green-600 hover:bg-green-700">
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTable(null)
                    setAction(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <div className={`p-4 ${getStatusColor(table.status)}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Table {table.number}</h3>
                <span className="text-sm capitalize">{table.status}</span>
              </div>
              <p className="text-sm">Capacity: {table.capacity} people</p>
            </div>
            <CardContent className="p-4">
              {table.status !== "available" && (
                <div className="mb-4">
                  <p className="text-sm">
                    <strong>Customer:</strong> {table.customer}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {table.time}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {table.status === "available" && (
                  <>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleTableAction(table, "occupy")}
                    >
                      Occupy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleTableAction(table, "reserve")}
                    >
                      Reserve
                    </Button>
                  </>
                )}

                {table.status !== "available" && (
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => releaseTable(table.id)}>
                    Release Table
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
