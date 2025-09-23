
"use client"

import { useMemo, useState } from "react"
import { useStore } from "../store/store"
import type { DistributorRequest, Status } from "../types"

export default function DistributorRequests() {
  const { state, checkAvailability, acceptDistributorRequest, rejectDistributorRequest } = useStore()
  const [status, setStatus] = useState<Status | "all">("pending")
  const [product, setProduct] = useState("")

  const rows = useMemo(
    () =>
      state.distributorRequests.filter((r) => {
        const sOk = status === "all" ? true : r.status === status
        const pOk = product ? r.productName.toLowerCase().includes(product.toLowerCase()) : true
        return sOk && pOk
      }),
    [state.distributorRequests, status, product],
  )

  return (
    <section aria-labelledby="dist-title" className="space-y-4">
      <h1 id="dist-title" className="text-2xl font-semibold text-pretty">
        Distributor Requests
      </h1>

      <div className="flex flex-wrap gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Status</span>
          <select
            className="rounded-md border border-input bg-background px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            aria-label="Filter by status"
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="responded">Responded</option>
            <option value="all">All</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Product</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-2"
            placeholder="e.g. Tomato"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            aria-label="Filter by product"
          />
        </label>
      </div>

      <div
        role="table"
        aria-label="Distributor requests table"
        className="rounded-lg border border-border bg-card overflow-hidden"
      >
        <div role="row" className="hidden lg:grid grid-cols-8 bg-secondary font-semibold">
          <div className="px-3 py-2">Distributor</div>
          <div className="px-3 py-2">Product</div>
          <div className="px-3 py-2">Owner</div>
          <div className="px-3 py-2">Quantity</div>
          <div className="px-3 py-2">Date</div>
          <div className="px-3 py-2">Status</div>
          <div className="px-3 py-2">Availability</div>
          <div className="px-3 py-2">Actions</div>
        </div>

        {rows.map((r: DistributorRequest) => {
          const available = checkAvailability(r.productName, r.quantity, r.owner)
          return (
            <div role="row" key={r.id} className="grid lg:grid-cols-8 grid-cols-2 border-t border-border">
              <div className="px-3 py-2">{r.distributorName}</div>
              <div className="px-3 py-2">{r.productName}</div>
              <div className="px-3 py-2">{r.owner || "—"}</div>
              <div className="px-3 py-2">
                {r.quantity} {r.unit}
              </div>
              <div className="px-3 py-2">{new Date(r.requestDate).toLocaleDateString()}</div>
              <div
                className={`px-3 py-2 font-semibold ${r.status === "accepted" ? "text-primary" : r.status === "rejected" ? "text-destructive" : r.status === "responded" ? "text-primary" : "text-accent-foreground"}`}
              >
                {r.status}
              </div>
              <div className="px-3 py-2">
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium
                  ${available ? "border-primary/30 text-primary bg-secondary" : "border-destructive/30 text-destructive bg-secondary"}`}
                >
                  {available ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
                    onClick={() => acceptDistributorRequest(r.id)}
                    disabled={!available || r.status !== "pending"}
                  >
                    Accept
                  </button>
                  <button
                    className="rounded-md bg-destructive text-destructive-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
                    onClick={() => rejectDistributorRequest(r.id)}
                    disabled={r.status !== "pending"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {rows.length === 0 && <div className="px-3 py-4 text-muted-foreground">No distributor requests found.</div>}
      </div>
    </section>
  )
}
