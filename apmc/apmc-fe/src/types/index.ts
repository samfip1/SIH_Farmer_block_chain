export type Status = "pending" | "accepted" | "rejected" | "responded"

export interface FarmerRequest {
  id: string
  type: "farmer"
  farmerName: string
  location: string
  cropName: string
  quality: string
  quantity: number
  unit: string
  expectedPrice: number
  requestDate: string
  status: Status
  notes?: string
  imageUrl?: string
  apmcResponse?: string
}

export interface DistributorRequest {
  id: string
  type: "distributor"
  distributorName: string
  productName: string
  owner?: string
  quantity: number
  unit: string
  expectedPrice?: number
  requestDate: string
  status: Status
  notes?: string
}

export interface InventoryItem {
  id: string
  owner?: string
  productName: string
  quantity: number
  unit: string
}

export interface User {
  id: string
  email: string
  role: "apmc"
}
