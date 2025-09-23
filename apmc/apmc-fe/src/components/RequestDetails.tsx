"use client"

import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useStore } from "../store/store"

export default function RequestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, acceptFarmerRequest, rejectFarmerRequest, respondFarmerRequest } = useStore()
  const req = state.farmerRequests.find((r) => r.id === id)

  const [message, setMessage] = useState(req?.apmcResponse ?? "")

  if (!req) {
    return (
      <div>
        <p>Request not found.</p>
        <Link className="btn btn-link" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <section aria-labelledby="detail-title" className="space-y-4">
      <Link className="text-primary underline underline-offset-4" to="/dashboard">
        ← Back
      </Link>
      <h1 id="detail-title" className="text-2xl font-semibold text-pretty">
        Request Detail
      </h1>

      <div className="grid md:grid-cols-[minmax(260px,360px)_1fr] gap-4 items-start">
        <div>
          <img
            src={req.imageUrl || "/placeholder.svg?height=200&width=300&query=crop%20image"}
            alt={`Crop image of ${req.cropName}`}
            className="w-full h-auto rounded-lg border border-border bg-secondary"
          />
        </div>
        <div className="grid gap-1 text-sm">
          <div>
            <strong>Farmer:</strong> {req.farmerName}
          </div>
          <div>
            <strong>Location:</strong> {req.location}
          </div>
          <div>
            <strong>Crop:</strong> {req.cropName}
          </div>
          <div>
            <strong>Quality:</strong> {req.quality}
          </div>
          <div>
            <strong>Quantity:</strong> {req.quantity} {req.unit}
          </div>
          <div>
            <strong>Expected Price:</strong> ₹{req.expectedPrice}
          </div>
          <div>
            <strong>Request Date:</strong> {new Date(req.requestDate).toLocaleString()}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              className={`inline-block rounded-full border border-border px-2 py-0.5 text-xs font-medium
              ${
                req.status === "accepted"
                  ? "bg-secondary text-primary border-primary/30"
                  : req.status === "rejected"
                    ? "bg-secondary text-destructive border-destructive/30"
                    : req.status === "responded"
                      ? "bg-secondary text-primary border-primary/30"
                      : "bg-secondary text-accent-foreground border-amber-300"
              }`}
            >
              {req.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Farmer Notes</h2>
        <p className="text-sm">{req.notes || "—"}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold">APMC Actions</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={() => acceptFarmerRequest(req.id)}
            disabled={req.status !== "pending"}
          >
            Accept
          </button>
          <button
            className="rounded-md bg-destructive text-destructive-foreground px-3 py-1.5 font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={() => rejectFarmerRequest(req.id)}
            disabled={req.status !== "pending"}
          >
            Reject
          </button>
        </div>
        <div className="mt-3">
          <label htmlFor="apmc-response" className="text-sm font-medium">
            Respond to Farmer
          </label>
          <textarea
            id="apmc-response"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 min-h-28 outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write a message / counter-offer / reason"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-2">
            <button
              className="rounded-md border border-primary text-primary px-3 py-1.5 font-semibold hover:bg-secondary disabled:opacity-50"
              onClick={() => {
                respondFarmerRequest(req.id, message.trim())
                navigate("/dashboard")
              }}
              disabled={!message.trim()}
            >
              Send Response
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-semibold">APMC Response (visible on farmer card)</h2>
        <p className="text-sm">{req.apmcResponse || "—"}</p>
      </div>
    </section>
  )
}
