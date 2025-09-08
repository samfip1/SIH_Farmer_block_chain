"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { User, ShoppingCart, Send, Settings, LogOut, Leaf, TrendingUp, Package } from "lucide-react"
import ProfileSettings from "./profile-settings"
import DistributorRequests from "./distributer-requests"
import OrdersPage from "./orders-pagge"

interface DashboardProps {
  user: any
  onSignOut: () => void
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // TODO: Replace with API call to fetch real-time earnings data
  const totalEarnings = 45750 // Mock data - will be replaced with backend API

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} />
      case "orders":
        return <OrdersPage />
      case "requests":
        return <DistributorRequests />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Welcome back, {user?.name || "Farmer"}!</h2>
                  <p className="text-green-600">Ready to grow your harvest today?</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-100 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Connect to backend API for real earnings data */}
                  <div className="text-2xl font-bold text-green-800">₹{totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Active Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Connect to backend API for real orders count */}
                  <div className="text-2xl font-bold text-green-800">8</div>
                  <p className="text-xs text-green-600 mt-1">3 pending delivery</p>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Requests Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TODO: Connect to backend API for real requests count */}
                  <div className="text-2xl font-bold text-green-800">5</div>
                  <p className="text-xs text-green-600 mt-1">2 awaiting response</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-green-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab("orders")}
                    className="bg-green-600 hover:bg-green-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    <span>View Orders</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("requests")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Send className="h-6 w-6" />
                    <span>Send Request</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("profile")}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-green-800">FarmDash</h1>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/farmer-avatar.png" />
                <AvatarFallback className="bg-green-100 text-green-700">{user?.name?.charAt(0) || "F"}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-green-700 hover:bg-green-100">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Leaf },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "requests", label: "Requests", icon: Send },
              { id: "profile", label: "Profile", icon: User },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-green-500 text-green-700"
                    : "border-transparent text-green-600 hover:text-green-700 hover:border-green-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
    </div>
  )
}
