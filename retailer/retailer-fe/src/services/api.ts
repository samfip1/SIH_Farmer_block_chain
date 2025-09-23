// import type { RetailerData, Product, ProductRequest, Supplier, AuthData } from "../types"

import type { RetailerData, Product, ProductRequest, Supplier, AuthData } from "../types"

const API_BASE_URL =  "http://localhost:3001/api"

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        // TODO: Add authentication headers
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; retailer: RetailerData }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(authData: AuthData) {
    return this.request<{ token: string; retailer: RetailerData }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(authData),
    })
  }

  // Retailer endpoints
  async getRetailerProfile(): Promise<RetailerData> {
    return this.request<RetailerData>("/retailer/profile")
  }

  async updateRetailerProfile(updates: Partial<RetailerData>): Promise<RetailerData> {
    return this.request<RetailerData>("/retailer/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products")
  }

  async requestProduct(productData: Partial<Product>): Promise<Product> {
    return this.request<Product>("/products/request", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProductPrice(productId: string, finalPrice: number): Promise<Product> {
    return this.request<Product>(`/products/${productId}/price`, {
      method: "PUT",
      body: JSON.stringify({ finalPrice }),
    })
  }

  // Supplier endpoints
  async getSuppliers(): Promise<Supplier[]> {
    return this.request<Supplier[]>("/suppliers")
  }

  async getSupplierProducts(supplierId: string): Promise<Product[]> {
    return this.request<Product[]>(`/suppliers/${supplierId}/products`)
  }

  // Request endpoints
  async getProductRequests(): Promise<ProductRequest[]> {
    return this.request<ProductRequest[]>("/requests")
  }

  async createProductRequest(requestData: Partial<ProductRequest>): Promise<ProductRequest> {
    return this.request<ProductRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(requestData),
    })
  }
}

export const apiService = new ApiService()
