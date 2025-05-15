"use client";

import {
  Menu,
  TableIcon as TableBar,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  LogOut,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: Menu, label: "Menu", color: "text-green-600" },
  { icon: TableBar, label: "Table Services", color: "text-gray-600" },
  { icon: CalendarRange, label: "Reservation", color: "text-gray-600" },
  { icon: Truck, label: "Delivery", color: "text-gray-600" },
  { icon: Calculator, label: "Accounting", color: "text-gray-600" },
  { icon: Database, label: "CRUD", color: "text-gray-600" },
  { icon: Settings, label: "Settings", color: "text-gray-600" },
];

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="w-64 p-4 border-r h-screen">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="/img10.jpeg?height=32&width=32"
          alt="South Indian Delights Logo"
          className="w-8 h-8"
        />
        <span className="font-semibold">SOUTH INDIAN DELIGHTS</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === item.label
                ? "bg-green-50 text-green-600"
                : item.color
            }`}
            onClick={() => setActiveTab(item.label)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start mt-auto text-gray-600 absolute bottom-4"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        LogOut
      </Button>
    </div>
  );
}
