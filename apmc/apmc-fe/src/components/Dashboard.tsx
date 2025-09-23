"use client"

import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store/store"
import { ExportCSVButton } from "../utils/export-csv"
import type { Status } from "../types"

export default function Dashboard() {
  const { state, acceptFarmerRequest, rejectFarmerRequest } = useStore()
  const [status, setStatus] = useState<Status | "all">("pending")
  const [crop, setCrop] = useState<string>("")

  const filtered = useMemo(() => {
    return state.farmerRequests.filter((r) => {
      const statusOk = status === "all" ? true : r.status === status
      const cropOk = crop ? r.cropName.toLowerCase().includes(crop.toLowerCase()) : true
      return statusOk && cropOk
    })
  }, [state.farmerRequests, status, crop])

  return (
    <section aria-labelledby="dashboard-title" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 id="dashboard-title" className="text-2xl font-semibold text-pretty">
          Request Management Dashboard
        </h1>
        <div className="shrink-0">
          <ExportCSVButton filename="farmer-requests.csv" rows={filtered} />
        </div>
      </div>

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
          <span className="text-sm font-medium">Crop name</span>
          <input
            className="rounded-md border border-input bg-background px-3 py-2"
            placeholder="e.g. Tomato"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            aria-label="Filter by crop name"
          />
        </label>
      </div>

      <div
        role="table"
        aria-label="Farmer requests table"
        className="rounded-lg border border-border bg-card overflow-hidden"
      >
        <div role="row" className="hidden lg:grid grid-cols-10 bg-secondary font-semibold">
          <div className="px-3 py-2">Farmer</div>
          <div className="px-3 py-2">Location</div>
          <div className="px-3 py-2">Crop</div>
          <div className="px-3 py-2">Quality</div>
          <div className="px-3 py-2">Qty</div>
          <div className="px-3 py-2">Price</div>
          <div className="px-3 py-2">Date</div>
          <div className="px-3 py-2">Status</div>
          <div className="px-3 py-2">APMC Response</div>
          <div className="px-3 py-2">Actions</div>
        </div>

        {filtered.map((r) => (
          <div role="row" key={r.id} className="grid lg:grid-cols-10 grid-cols-2 border-t border-border">
            <div className="px-3 py-2">{r.farmerName}</div>
            <div className="px-3 py-2">{r.location}</div>
            <div className="px-3 py-2">{r.cropName}</div>
            <div className="px-3 py-2">{r.quality}</div>
            <div className="px-3 py-2">
              {r.quantity} {r.unit}
            </div>
            <div className="px-3 py-2">₹{r.expectedPrice}</div>
            <div className="px-3 py-2">{new Date(r.requestDate).toLocaleDateString()}</div>
            <div
              className={`px-3 py-2 font-semibold ${r.status === "accepted" ? "text-primary" : r.status === "rejected" ? "text-destructive" : r.status === "responded" ? "text-primary" : "text-accent-foreground"}`}
            >
              {r.status}
            </div>
            <div className="px-3 py-2">{r.apmcResponse ? r.apmcResponse : "-"}</div>
            <div className="px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  className="text-primary underline underline-offset-4"
                  to={`/requests/${r.id}`}
                  aria-label={`View request ${r.id}`}
                >
                  View
                </Link>
                <button
                  className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
                  onClick={() => acceptFarmerRequest(r.id)}
                  disabled={r.status !== "pending"}
                >
                  Accept
                </button>
                <button
                  className="rounded-md bg-destructive text-destructive-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
                  onClick={() => rejectFarmerRequest(r.id)}
                  disabled={r.status !== "pending"}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-4 text-muted-foreground">No requests match the current filters.</div>
        )}
      </div>
    </section>
  )
}
