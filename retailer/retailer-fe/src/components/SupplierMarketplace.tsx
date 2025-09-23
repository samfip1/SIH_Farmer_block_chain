"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Building2, Search, Star, Clock, MapPin, Package } from "lucide-react"

const mockSuppliers = [
  {
    id: "SUP-001",
    name: "Green Valley Farms",
    type: "Company",
    location: "California, USA",
    specialties: ["Organic Fruits", "Vegetables", "Herbs"],
    rating: 4.8,
    totalReviews: 156,
    responseTime: "2-3 days",
    verified: true,
    description: "Premium organic produce supplier with 20+ years of experience in sustainable farming.",
    products: ["Organic Apples", "Organic Carrots", "Fresh Herbs", "Seasonal Vegetables"],
  },
  {
    id: "SUP-002",
    name: "Dairy Co-op",
    type: "Wholesaler",
    location: "Wisconsin, USA",
    specialties: ["Dairy Products", "Organic Milk", "Cheese"],
    rating: 4.6,
    totalReviews: 89,
    responseTime: "1-2 days",
    verified: true,
    description: "Cooperative of local dairy farmers providing fresh, high-quality dairy products.",
    products: ["Organic Milk", "Artisan Cheese", "Butter", "Yogurt"],
  },
  {
    id: "SUP-003",
    name: "Artisan Bakery",
    type: "Company",
    location: "New York, USA",
    specialties: ["Fresh Bread", "Pastries", "Gluten-Free"],
    rating: 4.9,
    totalReviews: 203,
    responseTime: "Same day",
    verified: true,
    description: "Traditional bakery specializing in artisan breads and pastries made with organic ingredients.",
    products: ["Sourdough Bread", "Croissants", "Gluten-Free Options", "Custom Cakes"],
  },
  {
    id: "SUP-004",
    name: "Farm Fresh Co",
    type: "Wholesaler",
    location: "Oregon, USA",
    specialties: ["Organic Vegetables", "Seasonal Produce", "Berries"],
    rating: 4.7,
    totalReviews: 134,
    responseTime: "2-4 days",
    verified: false,
    description: "Regional wholesaler connecting local farms with retailers across the Pacific Northwest.",
    products: ["Seasonal Berries", "Root Vegetables", "Leafy Greens", "Squash"],
  },
]

export function SupplierMarketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const filteredSuppliers = mockSuppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      supplier.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = selectedType === "all" || supplier.type.toLowerCase() === selectedType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers, products, or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 bg-input border border-border rounded-md text-sm"
        >
          <option value="all">All Types</option>
          <option value="company">Companies</option>
          <option value="wholesaler">Wholesalers</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    {supplier.verified && (
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {supplier.location}
                    </span>
                    <Badge variant="outline">{supplier.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-semibold">{supplier.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">({supplier.totalReviews} reviews)</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{supplier.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Package className="w-3 h-3" />
                  Specialties
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Popular Products</div>
                <div className="text-sm text-muted-foreground">
                  {supplier.products.slice(0, 3).join(", ")}
                  {supplier.products.length > 3 && ` +${supplier.products.length - 3} more`}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Response: {supplier.responseTime}
                </div>
                <Button size="sm">Request Products</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
