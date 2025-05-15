"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { SidebarNav } from "@/components/sidebar-nav";
import { Header } from "@/components/header";
import { CategoryFilter } from "@/components/category-filter";
import { FoodGrid } from "@/components/food-grid";
import { Cart as CartComponent } from "@/components/cart";
import { Footer } from "@/components/footer";
import { TableServices } from "@/components/table-services";
import { Reservation } from "@/components/reservation";
import { Delivery } from "@/components/delivery";
import { Accounting } from "@/components/accounting";
import { Settings } from "@/components/settings";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Menu");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadMenuItems() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error(`Failed to fetch menu: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.items) {
          throw new Error("No menu items found in response");
        }

        setMenuItems(data.items);
        console.log("Menu items loaded:", data.items);
      } catch (error) {
        console.error("Error loading menu:", error);
        setError(error instanceof Error ? error.message : "Failed to load menu items");
        toast({
          title: "Error",
          description: "Failed to load menu items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadMenuItems();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "CRUD") {
      router.push("/dashboard/crud");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-4">
            {activeTab === "Menu" && (
              <>
                <CategoryFilter />
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">
                    {error}
                    <button
                      onClick={() => window.location.reload()}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <FoodGrid />
                )}
              </>
            )}
            {activeTab === "Table Services" && <TableServices />}
            {activeTab === "Reservation" && <Reservation />}
            {activeTab === "Delivery" && <Delivery />}
            {activeTab === "Accounting" && <Accounting />}
            {activeTab === "Settings" && <Settings />}
          </main>
          <CartComponent/>
        </div>
        <Footer />
      </div>
    </div>
  );
}
