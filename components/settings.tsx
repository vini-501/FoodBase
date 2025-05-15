"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export function Settings() {
  const { toast } = useToast()
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "South Indian Delights",
    address: "123 Marina Beach Road, Chennai, Tamil Nadu",
    phone: "+91 9876543210",
    email: "contact@southindiandelights.com",
    gstNumber: "GSTIN12345678901",
    openingTime: "11:00",
    closingTime: "22:00",
  })

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    lowInventory: true,
    dailyReports: false,
    customerReviews: true,
  })

  const [printerSettings, setPrinterSettings] = useState({
    enabled: true,
    printerName: "EPSON TM-T88VI",
    printReceipts: true,
    printKitchenOrders: true,
    autoPrint: true,
  })

  const handleRestaurantInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurantInfo({
      ...restaurantInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value,
    })
  }

  const handlePrinterSettingChange = (key: string, value: any) => {
    setPrinterSettings({
      ...printerSettings,
      [key]: value,
    })
  }

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="restaurant" className="space-y-4">
        <TabsList>
          <TabsTrigger value="restaurant">Restaurant Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="printing">Printing</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant details and business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input id="name" name="name" value={restaurantInfo.name} onChange={handleRestaurantInfoChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={restaurantInfo.address}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={restaurantInfo.phone} onChange={handleRestaurantInfoChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={restaurantInfo.email}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    value={restaurantInfo.gstNumber}
                    onChange={handleRestaurantInfoChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingTime">Opening Time</Label>
                    <Input
                      id="openingTime"
                      name="openingTime"
                      type="time"
                      value={restaurantInfo.openingTime}
                      onChange={handleRestaurantInfoChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingTime">Closing Time</Label>
                    <Input
                      id="closingTime"
                      name="closingTime"
                      type="time"
                      value={restaurantInfo.closingTime}
                      onChange={handleRestaurantInfoChange}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure which notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrders" className="font-medium">
                      New Orders
                    </Label>
                    <p className="text-sm text-gray-500">Get notified when a new order is placed</p>
                  </div>
                  <Switch
                    id="newOrders"
                    checked={notifications.newOrders}
                    onCheckedChange={(checked) => handleNotificationChange("newOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates" className="font-medium">
                      Order Updates
                    </Label>
                    <p className="text-sm text-gray-500">Get notified when an order status changes</p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowInventory" className="font-medium">
                      Low Inventory
                    </Label>
                    <p className="text-sm text-gray-500">Get notified when inventory items are running low</p>
                  </div>
                  <Switch
                    id="lowInventory"
                    checked={notifications.lowInventory}
                    onCheckedChange={(checked) => handleNotificationChange("lowInventory", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dailyReports" className="font-medium">
                      Daily Reports
                    </Label>
                    <p className="text-sm text-gray-500">Receive daily sales and performance reports</p>
                  </div>
                  <Switch
                    id="dailyReports"
                    checked={notifications.dailyReports}
                    onCheckedChange={(checked) => handleNotificationChange("dailyReports", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerReviews" className="font-medium">
                      Customer Reviews
                    </Label>
                    <p className="text-sm text-gray-500">Get notified when customers leave reviews</p>
                  </div>
                  <Switch
                    id="customerReviews"
                    checked={notifications.customerReviews}
                    onCheckedChange={(checked) => handleNotificationChange("customerReviews", checked)}
                  />
                </div>
              </div>

              <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printing">
          <Card>
            <CardHeader>
              <CardTitle>Printer Settings</CardTitle>
              <CardDescription>Configure your receipt and kitchen printer settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="printerEnabled" className="font-medium">
                  Enable Printing
                </Label>
                <Switch
                  id="printerEnabled"
                  checked={printerSettings.enabled}
                  onCheckedChange={(checked) => handlePrinterSettingChange("enabled", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printerName">Printer Name</Label>
                <Input
                  id="printerName"
                  value={printerSettings.printerName}
                  onChange={(e) => handlePrinterSettingChange("printerName", e.target.value)}
                  disabled={!printerSettings.enabled}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printReceipts" className="font-medium">
                      Print Customer Receipts
                    </Label>
                    <p className="text-sm text-gray-500">Automatically print receipts for customers</p>
                  </div>
                  <Switch
                    id="printReceipts"
                    checked={printerSettings.printReceipts}
                    onCheckedChange={(checked) => handlePrinterSettingChange("printReceipts", checked)}
                    disabled={!printerSettings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printKitchenOrders" className="font-medium">
                      Print Kitchen Orders
                    </Label>
                    <p className="text-sm text-gray-500">Automatically print orders for the kitchen</p>
                  </div>
                  <Switch
                    id="printKitchenOrders"
                    checked={printerSettings.printKitchenOrders}
                    onCheckedChange={(checked) => handlePrinterSettingChange("printKitchenOrders", checked)}
                    disabled={!printerSettings.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoPrint" className="font-medium">
                      Auto-Print on Order
                    </Label>
                    <p className="text-sm text-gray-500">Automatically print when an order is placed</p>
                  </div>
                  <Switch
                    id="autoPrint"
                    checked={printerSettings.autoPrint}
                    onCheckedChange={(checked) => handlePrinterSettingChange("autoPrint", checked)}
                    disabled={!printerSettings.enabled}
                  />
                </div>
              </div>

              <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Configure your database connection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mb-4">
                <p className="font-medium">Development Mode</p>
                <p className="text-sm mt-1">
                  The application is currently running in development mode using browser storage. In production, you
                  would connect to your local SQL server.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbHost">Database Host</Label>
                <Input id="dbHost" defaultValue="localhost" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbPort">Database Port</Label>
                <Input id="dbPort" defaultValue="5432" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbName">Database Name</Label>
                <Input id="dbName" defaultValue="restaurant_pos" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbUser">Database User</Label>
                <Input id="dbUser" defaultValue="postgres" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbPassword">Database Password</Label>
                <Input id="dbPassword" type="password" defaultValue="********" />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Development Mode",
                      description:
                        "Database connection simulation successful. In production, this would connect to your actual database.",
                    })
                  }}
                >
                  Test Connection
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Development Mode",
                      description:
                        "Database initialized in browser storage. In production, this would set up your actual database schema.",
                    })
                  }}
                >
                  Initialize Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
