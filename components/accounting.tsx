"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function Accounting() {
  const [dateRange, setDateRange] = useState("week")

  // Sample data for sales by category
  const salesByCategory = [
    { name: "Breakfast", value: 4200 },
    { name: "Main Course", value: 6800 },
    { name: "Soups", value: 1500 },
    { name: "Beverages", value: 2300 },
    { name: "Desserts", value: 1800 },
  ]

  // Sample data for daily sales
  const dailySales = [
    { day: "Mon", sales: 1200 },
    { day: "Tue", sales: 1400 },
    { day: "Wed", sales: 1800 },
    { day: "Thu", sales: 1600 },
    { day: "Fri", sales: 2200 },
    { day: "Sat", sales: 2800 },
    { day: "Sun", sales: 2400 },
  ]

  // Sample data for monthly sales
  const monthlySales = [
    { month: "Jan", sales: 28000 },
    { month: "Feb", sales: 32000 },
    { month: "Mar", sales: 35000 },
    { month: "Apr", sales: 30000 },
    { month: "May", sales: 40000 },
    { month: "Jun", sales: 42000 },
  ]

  // Sample data for expenses
  const expenses = [
    { category: "Ingredients", amount: 12000 },
    { category: "Staff", amount: 18000 },
    { category: "Rent", amount: 8000 },
    { category: "Utilities", amount: 3000 },
    { category: "Marketing", amount: 2000 },
    { category: "Other", amount: 1500 },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Calculate total sales and expenses
  const totalSales = salesByCategory.reduce((sum, item) => sum + item.value, 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const profit = totalSales - totalExpenses
  const profitMargin = ((profit / totalSales) * 100).toFixed(2)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profit.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Margin: {profitMargin}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="mb-6">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${dateRange === "week" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                  onClick={() => setDateRange("week")}
                >
                  Week
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-md ${dateRange === "month" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                  onClick={() => setDateRange("month")}
                >
                  Month
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dateRange === "week" ? dailySales : monthlySales}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dateRange === "week" ? "day" : "month"} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                    <Legend />
                    <Bar dataKey="sales" fill="#4ade80" name="Sales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenses} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="category" type="category" />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey="amount" fill="#f97316" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Masala Dosa", quantity: 342, revenue: 3074.58 },
                { name: "Hyderabadi Biryani", quantity: 256, revenue: 3837.44 },
                { name: "Idli Sambar", quantity: 215, revenue: 1502.85 },
                { name: "Filter Coffee", quantity: 198, revenue: 592.02 },
                { name: "Chettinad Chicken Curry", quantity: 187, revenue: 2429.13 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
