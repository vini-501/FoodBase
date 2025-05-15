"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { loginUser } from "@/lib/actions"
import { FoodBackground } from "@/components/food-background"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call the server action to login
      const result = await loginUser(formData)

      // Also store user data in localStorage for client-side access
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          id: result.userId,
          ...formData,
        }),
      )

      // Redirect to dashboard instead of home page
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Login failed:", error)
      // Show error message to user
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-orange-100 to-amber-200" />}>
          <FoodBackground />
        </Suspense>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2H2v10h10V2z" />
                <path d="M17.5 17.5c-2.5 0-4.5-2-4.5-4.5 0-2.5 2-4.5 4.5-4.5 2.5 0 4.5 2 4.5 4.5 0 2.5-2 4.5-4.5 4.5z" />
                <path d="M22 22H2v-2h20v2z" />
                <path d="M15 13h5" />
                <path d="M17.5 10.5v5" />
                <path d="M5 7h4" />
                <path d="M7 5v4" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-green-800">South Indian Delights</CardTitle>
            <CardDescription className="text-lg mt-2">Experience authentic flavors</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your name"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-white/70"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/70"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your mobile number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white/70"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" disabled={loading}>
                {loading ? "Logging in..." : "Experience South Indian Cuisine"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
