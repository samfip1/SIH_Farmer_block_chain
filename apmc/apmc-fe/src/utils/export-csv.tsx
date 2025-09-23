"use client"

import type { FarmerRequest } from "../types"

function toCSV(rows: FarmerRequest[]): string {
  const headers = [
    "id",
    "farmerName",
    "location",
    "cropName",
    "quality",
    "quantity",
    "unit",
    "expectedPrice",
    "requestDate",
    "status",
    "notes",
    "apmcResponse",
  ]
  const escape = (val: any) => {
    const s = val === undefined || val === null ? "" : String(val)
    return `"${s.replace(/"/g, '""')}"`
  }
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.farmerName,
        r.location,
        r.cropName,
        r.quality,
        r.quantity,
        r.unit,
        r.expectedPrice,
        r.requestDate,
        r.status,
        r.notes || "",
        r.apmcResponse || "",
      ]
        .map(escape)
        .join(","),
    ),
  ]
  return lines.join("\n")
}

export function ExportCSVButton({ rows, filename }: { rows: FarmerRequest[]; filename: string }) {
  function handleExport() {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <button
      className="rounded-md border border-primary text-primary px-3 py-2 font-semibold hover:bg-secondary"
      onClick={handleExport}
      aria-label="Export to CSV (Google Sheets)"
    >
      Export to Sheets (CSV)
    </button>
  )
}
