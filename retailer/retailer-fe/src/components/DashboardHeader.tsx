"use client"

// import { Button } from "./ui/button"
import { Package, MapPin, User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

interface DashboardHeaderProps {
  retailerData: {
    retailerUniqueId: string
    storeLocation: string
    totalProducts: number
    pendingRequests: number
    approvedRequests: number
    totalRevenue: number
  }
}

export function DashboardHeader({ retailerData }: DashboardHeaderProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">RetailChain Dashboard</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {retailerData.retailerUniqueId}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {retailerData.storeLocation}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="sm:w-auto bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
