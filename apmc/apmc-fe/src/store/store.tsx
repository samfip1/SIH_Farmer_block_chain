"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import type { DistributorRequest, FarmerRequest, InventoryItem } from "../types"
import { seedData } from "./seed"

type State = {
  farmerRequests: FarmerRequest[]
  distributorRequests: DistributorRequest[]
  inventory: InventoryItem[]
}

type Action =
  | { type: "ACCEPT_REQUEST"; id: string }
  | { type: "REJECT_REQUEST"; id: string }
  | { type: "RESPOND_REQUEST"; id: string; message: string }
  | { type: "ADD_INVENTORY"; item: InventoryItem }
  | { type: "UPDATE_INVENTORY"; id: string; quantity: number }
  | { type: "ACCEPT_DREQ"; id: string }
  | { type: "REJECT_DREQ"; id: string }
  | { type: "LOAD"; state: State }

const STORAGE_KEY = "apmc_state_v1"

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ACCEPT_REQUEST":
      return {
        ...state,
        farmerRequests: state.farmerRequests.map((r) => (r.id === action.id ? { ...r, status: "accepted" } : r)),
      }
    case "REJECT_REQUEST":
      return {
        ...state,
        farmerRequests: state.farmerRequests.map((r) => (r.id === action.id ? { ...r, status: "rejected" } : r)),
      }
    case "RESPOND_REQUEST":
      return {
        ...state,
        farmerRequests: state.farmerRequests.map((r) =>
          r.id === action.id ? { ...r, apmcResponse: action.message, status: "responded" } : r,
        ),
      }
    case "ADD_INVENTORY":
      return { ...state, inventory: [action.item, ...state.inventory] }
    case "UPDATE_INVENTORY":
      return {
        ...state,
        inventory: state.inventory.map((i) => (i.id === action.id ? { ...i, quantity: action.quantity } : i)),
      }
    case "ACCEPT_DREQ":
      return {
        ...state,
        distributorRequests: state.distributorRequests.map((r) =>
          r.id === action.id ? { ...r, status: "accepted" } : r,
        ),
      }
    case "REJECT_DREQ":
      return {
        ...state,
        distributorRequests: state.distributorRequests.map((r) =>
          r.id === action.id ? { ...r, status: "rejected" } : r,
        ),
      }
    case "LOAD":
      return action.state
    default:
      return state
  }
}

type StoreCtx = {
  state: State
  acceptFarmerRequest: (id: string) => void
  rejectFarmerRequest: (id: string) => void
  respondFarmerRequest: (id: string, message: string) => void
  addInventory: (item: InventoryItem) => void
  updateInventory: (id: string, quantity: number) => void
  checkAvailability: (productName: string, qty: number, owner?: string) => boolean
  acceptDistributorRequest: (id: string) => void
  rejectDistributorRequest: (id: string) => void
}

const StoreContext = createContext<StoreCtx | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, seedData)

  // load from localStorage on mount
  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      try {
        const parsed: State = JSON.parse(s)
        dispatch({ type: "LOAD", state: parsed })
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  // persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<StoreCtx>(() => {
    const acceptFarmerRequest = (id: string) => dispatch({ type: "ACCEPT_REQUEST", id })
    const rejectFarmerRequest = (id: string) => dispatch({ type: "REJECT_REQUEST", id })
    const respondFarmerRequest = (id: string, message: string) => dispatch({ type: "RESPOND_REQUEST", id, message })
    const addInventory = (item: InventoryItem) => dispatch({ type: "ADD_INVENTORY", item })
    const updateInventory = (id: string, quantity: number) => dispatch({ type: "UPDATE_INVENTORY", id, quantity })
    const acceptDistributorRequest = (id: string) => dispatch({ type: "ACCEPT_DREQ", id })
    const rejectDistributorRequest = (id: string) => dispatch({ type: "REJECT_DREQ", id })
    const checkAvailability = (productName: string, qty: number, owner?: string) => {
      const items = state.inventory.filter(
        (i) =>
          i.productName.toLowerCase() === productName.toLowerCase() &&
          (owner ? i.owner?.toLowerCase() === owner.toLowerCase() : true),
      )
      const total = items.reduce((sum, i) => sum + i.quantity, 0)
      return total >= qty
    }
    return {
      state,
      acceptFarmerRequest,
      rejectFarmerRequest,
      respondFarmerRequest,
      addInventory,
      updateInventory,
      checkAvailability,
      acceptDistributorRequest,
      rejectDistributorRequest,
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("Store not found")
  return ctx
}
