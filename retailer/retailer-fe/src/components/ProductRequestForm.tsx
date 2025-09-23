"use client"

import { useState } from "react"
import type React from "react"

// import { Button } from "./ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
// import { Input } from "./ui/input"
// import { Label } from "./ui/label"
// import { Textarea } from "./ui/textarea"
// import { Badge } from "./ui/badge"
import { X, Search, Building2, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"

import type { Product } from "../types"

interface ProductRequestFormProps {
  onClose: () => void
  onSubmit: (productData: Partial<Product>) => Promise<void>
}


// Mock suppliers data
const mockSuppliers = [
  {
    id: "SUP-001",
    name: "Green Valley Farms",
    type: "Company",
    specialties: ["Organic Fruits", "Vegetables"],
    rating: 4.8,
    responseTime: "2-3 days",
  },
  {
    id: "SUP-002",
    name: "Dairy Co-op",
    type: "Wholesaler",
    specialties: ["Dairy Products", "Organic Milk"],
    rating: 4.6,
    responseTime: "1-2 days",
  },
  {
    id: "SUP-003",
    name: "Artisan Bakery",
    type: "Company",
    specialties: ["Fresh Bread", "Pastries"],
    rating: 4.9,
    responseTime: "Same day",
  },
  {
    id: "SUP-004",
    name: "Farm Fresh Co",
    type: "Wholesaler",
    specialties: ["Organic Vegetables", "Seasonal Produce"],
    rating: 4.7,
    responseTime: "2-4 days",
  },
]

export function ProductRequestForm({ onClose, onSubmit }: ProductRequestFormProps) {
  const [step, setStep] = useState<"supplier" | "details">("supplier")
  const [selectedSupplier, setSelectedSupplier] = useState<(typeof mockSuppliers)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    quantity: "",
    maxPrice: "",
    shelfLifeRequirement: "",
    description: "",
    urgency: "medium",
  })

  const filteredSuppliers = mockSuppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSupplierSelect = (supplier: (typeof mockSuppliers)[0]) => {
    setSelectedSupplier(supplier)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    await onSubmit({
        name: formData.productName,
        category: formData.category,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        finalPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        shelfLife: formData.shelfLifeRequirement ? Number(formData.shelfLifeRequirement) : undefined,
        description: formData.description,
        supplier: selectedSupplier?.name || "",
        })

    onClose()
  } catch (error) {
    console.error("Failed to submit request:", error)
  } finally {
    setIsSubmitting(false)
  }
}


    const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
    ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    }


  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Request Product</CardTitle>
            <CardDescription>
              {step === "supplier" ? "Select a supplier to request products from" : "Provide product details"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "supplier" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => handleSupplierSelect(supplier)}
                    className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <Badge variant="outline">{supplier.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {supplier.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⭐ {supplier.rating}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {supplier.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === "details" && selectedSupplier && (
            <>
              <div className="p-4 bg-accent/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Requesting from: {selectedSupplier.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("supplier")}
                  className="text-xs text-muted-foreground"
                >
                  Change supplier
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Organic Apples"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm"
                    >
                      <option value="">Select category</option>
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="dairy">Dairy</option>
                      <option value="bakery">Bakery</option>
                      <option value="meat">Meat</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Needed</Label>
                    <Input
                      id="quantity"
                      placeholder="e.g., 50 lbs, 100 units"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice">Max Price per Unit ($)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.maxPrice}
                      onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shelfLife">Min. Shelf Life (days)</Label>
                    <Input
                      id="shelfLife"
                      type="number"
                      placeholder="7"
                      value={formData.shelfLifeRequirement}
                      onChange={(e) => handleInputChange("shelfLifeRequirement", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) =>
                        handleInputChange("urgency", e.target.value as "low" | "medium" | "high")
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm"
                    >
                    <option value="low">Low - Within 2 weeks</option>
                    <option value="medium">Medium - Within 1 week</option>
                    <option value="high">High - Within 3 days</option>
                    </select>

                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Requirements</Label>
                  <Textarea
                    id="description"
                    placeholder="Any specific requirements, certifications, or notes..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Request..." : "Send Request"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
