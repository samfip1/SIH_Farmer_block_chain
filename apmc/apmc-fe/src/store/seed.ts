import type { DistributorRequest, FarmerRequest, InventoryItem } from "../types"

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString()

export const seedFarmerRequests: FarmerRequest[] = [
  {
    id: "fr-1",
    type: "farmer",
    farmerName: "Ravi Kumar",
    location: "Nashik, MH",
    cropName: "Tomato",
    quality: "A",
    quantity: 1200,
    unit: "kg",
    expectedPrice: 18,
    requestDate: daysAgo(1),
    status: "pending",
    notes: "Freshly harvested yesterday.",
    imageUrl: "/tomato-crates-in-yard.jpg",
  },
  {
    id: "fr-2",
    type: "farmer",
    farmerName: "Sita Devi",
    location: "Indore, MP",
    cropName: "Onion",
    quality: "B",
    quantity: 800,
    unit: "kg",
    expectedPrice: 22,
    requestDate: daysAgo(2),
    status: "pending",
    notes: "Willing to negotiate price.",
    imageUrl: "/onion-sacks.jpg",
  },
]

export const seedDistributorRequests: DistributorRequest[] = [
  {
    id: "dr-1",
    type: "distributor",
    distributorName: "CityFresh Distributors",
    productName: "Tomato",
    owner: "Yard-Owner-1",
    quantity: 500,
    unit: "kg",
    requestDate: daysAgo(0),
    status: "pending",
    notes: "Urgent requirement",
  },
  {
    id: "dr-2",
    type: "distributor",
    distributorName: "AgriSupply Co",
    productName: "Potato",
    owner: "Yard-Owner-2",
    quantity: 300,
    unit: "kg",
    requestDate: daysAgo(1),
    status: "pending",
  },
]

export const seedInventory: InventoryItem[] = [
  { id: "inv-1", owner: "Yard-Owner-1", productName: "Tomato", quantity: 600, unit: "kg" },
  { id: "inv-2", owner: "Yard-Owner-2", productName: "Potato", quantity: 200, unit: "kg" },
  { id: "inv-3", owner: "Yard-Owner-1", productName: "Onion", quantity: 1000, unit: "kg" },
]

export const seedData = {
  farmerRequests: seedFarmerRequests,
  distributorRequests: seedDistributorRequests,
  inventory: seedInventory,
}
