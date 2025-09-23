export interface RetailerData {
  retailerUniqueId: string
  storeLocation: string
  totalProducts: number
  pendingRequests: number
  approvedRequests: number
  totalRevenue: number
  address?: string
  phoneNumber?: string
  businessName?: string
}
export interface Product {
  id: string
  produceUniqueId: string
  name: string
  supplier: string
  shelfLife: number // uint - days
  finalPrice: number // uint - price in cents or dollars
  status: "approved" | "pending" | "rejected"
  updatedAt: number // uint - blockchain timestamp
  category: string
  description?: string
  quantity?: number

  // urgency added
  urgency?: "low" | "medium" | "high"
}


export interface ProductRequest {
  id: string
  retailerUniqueId: string
  produceUniqueId: string
  requestedQuantity: number
  maxPrice: number
  preferredShelfLife: number
  status: "pending" | "approved" | "rejected"
  createdAt: number
  updatedAt: number
  supplierResponse?: string
}

export interface Supplier {
  id: string
  name: string
  location: string
  rating: number
  totalProducts: number
  responseTime: string
  verified: boolean
  specialties: string[]
}

export interface AuthData {
  businessName: string
  email: string
  password: string
  address: string
  phoneNumber: string
  storeLocation: string
}
