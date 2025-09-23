"use client"

import { useState, useEffect } from "react"
import type { RetailerData, Product } from "../types"
import { mockRetailerData, mockProducts } from "../data/mockData"

export const useRetailerData = () => {
  const [retailerData, setRetailerData] = useState<RetailerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const fetchRetailerData = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/retailer/profile')
        // const data = await response.json()

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRetailerData(mockRetailerData)
      } catch (err) {
        setError("Failed to fetch retailer data")
      } finally {
        setLoading(false)
      }
    }

    fetchRetailerData()
  }, [])

  const updateRetailerData = async (updates: Partial<RetailerData>) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/retailer/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(updates)
      // })

      setRetailerData((prev) => (prev ? { ...prev, ...updates } : null))
    } catch (err) {
      setError("Failed to update retailer data")
    }
  }

  return { retailerData, loading, error, updateRetailerData }
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch('/api/products')
        // const data = await response.json()

        await new Promise((resolve) => setTimeout(resolve, 800))
        setProducts(mockProducts)
      } catch (err) {
        setError("Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const requestProduct = async (productData: Partial<Product>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/products/request', {
      //   method: 'POST',
      //   body: JSON.stringify(productData)
      // })

      const newProduct: Product = {
        id: `PRD-${Date.now()}`,
        produceUniqueId: productData.produceUniqueId || `PROD-${Date.now()}`,
        name: productData.name || "",
        supplier: productData.supplier || "",
        shelfLife: productData.shelfLife || 0,
        finalPrice: productData.finalPrice || 0,
        status: "pending",
        updatedAt: Date.now(),
        category: productData.category || "",
        description: productData.description,
        quantity: productData.quantity,
      }

      setProducts((prev) => [...prev, newProduct])
      return newProduct
    } catch (err) {
      setError("Failed to request product")
      throw err
    }
  }

  return { products, loading, error, requestProduct }
}
