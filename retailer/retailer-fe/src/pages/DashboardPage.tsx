"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Users, Search, Plus, Clock, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { DashboardHeader } from "../components/DashboardHeader"
import { StatsCards } from "../components/StatsCards"
import { ProductRequestForm } from "../components/ProductRequestForm"
import { SupplierMarketplace } from "../components/SupplierMarketplace"
import { useRetailerData, useProducts } from "../hooks/useRetailerData"
import type { Product } from "../types"
// import type { Product } from "../types"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showRequestForm, setShowRequestForm] = useState(false)

  const { retailerData, loading: retailerLoading, error: retailerError } = useRetailerData()
  const { products, loading: productsLoading, error: productsError, requestProduct } = useProducts()

  if (retailerLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (retailerError || productsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!retailerData) {
    return null
  }

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success border-success/20"
      case "pending":
        return "bg-warning/10 text-warning border-warning/20"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const handleProductRequest = async (productData: Partial<Product>) => {
    try {
      await requestProduct(productData)
      setShowRequestForm(false)
    } catch (error) {
      console.error("Failed to request product:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader retailerData={retailerData} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <StatsCards retailerData={retailerData} />

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>Manage your store's product catalog and pricing</CardDescription>
                  </div>
                  <Button onClick={() => setShowRequestForm(true)} className="sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-input border border-border rounded-md text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Bakery</option>
                  </select>
                </div>

                <div className="grid gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card transition-colors"
                    >
                      <div className="space-y-2 sm:space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge variant="outline" className={getStatusColor(product.status)}>
                            {getStatusIcon(product.status)}
                            <span className="ml-1 capitalize">{product.status}</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {product.supplier}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {product.shelfLife} days shelf life
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(product.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">ID: {product.produceUniqueId}</div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <div className="font-semibold text-lg">${product.finalPrice}</div>
                          <div className="text-xs text-muted-foreground">Final Price</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Requests</CardTitle>
                <CardDescription>Track your requests to suppliers and wholesalers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .filter((p) => p.status === "pending")
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
                      >
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">Requested from {product.supplier}</p>
                        </div>
                        <Badge variant="outline" className={getStatusColor(product.status)}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1">Pending Approval</span>
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Marketplace</CardTitle>
                <CardDescription>Discover and connect with verified suppliers and wholesalers</CardDescription>
              </CardHeader>
              <CardContent>
                <SupplierMarketplace />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Request Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">74%</div>
                  <p className="text-sm text-muted-foreground">23 approved out of 31 total requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.3 days</div>
                  <p className="text-sm text-muted-foreground">Average supplier response time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {showRequestForm && (
        <ProductRequestForm onClose={() => setShowRequestForm(false)} onSubmit={handleProductRequest} />
      )}
    </div>
  )
}
