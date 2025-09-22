

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MapPin, Send, Plus, Eye, Clock, CheckCircle, XCircle, AlertCircle, Upload, Building2 } from "lucide-react"




interface APMCRequest {
  id: string
  cropName: string
  quantity: number
  unit: string
  priceExpected: number
  apmcId: string
  apmcName: string
  qualityExpected: string
  harvestDate: string
  imageUrl: string
  location: string
  status: "pending" | "accepted" | "rejected"
  requestDate: string
  notes?: string
  apmcResponse?: string
}

const mockRequests: APMCRequest[] = [
  {
    id: "REQ-001",
    cropName: "Tomatoes",
    quantity: 100,
    unit: "kg",
    priceExpected: 45,
    apmcId: "APMC-001",
    apmcName: "Mumbai APMC Yard",
    qualityExpected: "Grade A - Premium Quality",
    harvestDate: "2024-02-15",
    imageUrl: "/fresh-tomatoes.png",
    location: "Green Valley Farm, Maharashtra",
    status: "accepted",
    requestDate: "2024-02-01",
    notes: "Looking for premium quality tomatoes for market sale",
    apmcResponse: "Accepted! We'll purchase at ₹45/kg. Quality inspection scheduled for Feb 14th.",
  },
  {
    id: "REQ-002",
    cropName: "Carrots",
    quantity: 150,
    unit: "kg",
    priceExpected: 35,
    apmcId: "APMC-002",
    apmcName: "Pune APMC Market",
    qualityExpected: "Organic Certified",
    harvestDate: "2024-02-20",
    imageUrl: "/organic-carrots.png",
    location: "Green Valley Farm, Maharashtra",
    status: "pending",
    requestDate: "2024-02-05",
    notes: "Organic certification available",
  },
  {
    id: "REQ-003",
    cropName: "Spinach",
    quantity: 50,
    unit: "kg",
    priceExpected: 60,
    apmcId: "APMC-003",
    apmcName: "Nashik APMC Yard",
    qualityExpected: "Fresh, No Pesticides",
    harvestDate: "2024-02-25",
    imageUrl: "/fresh-spinach.png",
    location: "Green Valley Farm, Maharashtra",
    status: "pending",
    requestDate: "2024-02-08",
    notes: "Pesticide-free spinach, ready for immediate delivery",
  },
]

const mockAPMCs = [
  { id: "APMC-001", name: "Mumbai APMC Yard", rating: 4.8, location: "Mumbai", speciality: "Vegetables & Fruits" },
  { id: "APMC-002", name: "Pune APMC Market", rating: 4.6, location: "Pune", speciality: "Organic Produce" },
  { id: "APMC-003", name: "Nashik APMC Yard", rating: 4.9, location: "Nashik", speciality: "Onions & Vegetables" },
  { id: "APMC-004", name: "Aurangabad APMC", rating: 4.5, location: "Aurangabad", speciality: "Grains & Pulses" },
  { id: "APMC-005", name: "Nagpur APMC Market", rating: 4.7, location: "Nagpur", speciality: "Citrus Fruits" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "accepted":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "accepted":
      return <CheckCircle className="h-4 w-4" />
    case "rejected":
      return <XCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

export default function APMCRequests() {
  const [activeTab, setActiveTab] = useState<"requests" | "new">("requests")
  const [requests] = useState<APMCRequest[]>(mockRequests)
  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    priceExpected: "",
    apmcId: "",
    qualityExpected: "",
    harvestDate: "",
    imageUrl: "",
    location: "Green Valley Farm, Maharashtra",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sending request to APMC yard:", formData)
    setActiveTab("requests")
    // Reset form
    setFormData({
      cropName: "",
      quantity: "",
      unit: "kg",
      priceExpected: "",
      apmcId: "",
      qualityExpected: "",
      harvestDate: "",
      imageUrl: "",
      location: "Green Valley Farm, Maharashtra",
      notes: "",
    })
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for APMC yard response"
      case "accepted":
        return "APMC yard accepted your offer"
      case "rejected":
        return "APMC yard declined your offer"
      default:
        return "Unknown status"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-800">My APMC Sale Requests</h2>
          <p className="text-green-600">Send requests to APMC yards to sell your crops and track their responses</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("requests")}
            variant={activeTab === "requests" ? "default" : "outline"}
            className={
              activeTab === "requests"
                ? "bg-green-600 hover:bg-green-700"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }
          >
            <Eye className="h-4 w-4 mr-2" />
            My Requests
          </Button>
          <Button
            onClick={() => setActiveTab("new")}
            variant={activeTab === "new" ? "default" : "outline"}
            className={
              activeTab === "new"
                ? "bg-green-600 hover:bg-green-700"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Send New Request
          </Button>
        </div>
      </div>

      {activeTab === "requests" && (
        <>
          {/* Requests List */}
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-green-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image and Basic Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 rounded-lg">
                        <AvatarImage src={request.imageUrl || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-green-100 text-green-700 rounded-lg">
                          {request.cropName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-green-800 text-lg">{request.cropName}</h3>
                        <p className="text-green-600">{request.qualityExpected}</p>
                        <Badge className={`mt-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <p className="text-xs text-green-500 mt-1">{getStatusDescription(request.status)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">Sent to:</span> {request.apmcName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                      <div className="text-sm text-green-600">
                        <span className="font-medium">Sent on:</span>{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                    {request.notes && (
                      <div className="mt-2 text-sm text-green-600">
                        <span className="font-medium">Your Notes:</span> {request.notes}
                      </div>
                    )}
                    {request.apmcResponse && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-700">APMC Response:</p>
                        <p className="text-sm text-green-600 mt-1">{request.apmcResponse}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "new" && (
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800">Send Crop Sale Request to APMC Yard</CardTitle>
            <p className="text-green-600 text-sm">
              Fill out the details below to send a request to an APMC yard for selling your crops
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">Your Crop Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="cropName" className="text-green-700">
                      Crop Name *
                    </Label>
                    <Input
                      id="cropName"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleInputChange}
                      placeholder="e.g., Tomatoes, Carrots, Spinach"
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-green-700">
                      Product Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="border-green-200 focus:border-green-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-green-500">Image URL will be used to display your crop</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">APMC Yard Selection</h3>

                  <div className="space-y-2">
                    <Label htmlFor="apmcId" className="text-green-700">
                      Choose APMC Yard to Send Request *
                    </Label>
                    <select
                      id="apmcId"
                      name="apmcId"
                      value={formData.apmcId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select an APMC yard to contact</option>
                      {mockAPMCs.map((apmc) => (
                        <option key={apmc.id} value={apmc.id}>
                          {apmc.name} - {apmc.location} (★ {apmc.rating}) - {apmc.speciality}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-green-500">Choose the APMC yard where you want to sell your crops</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Request to APMC Yard
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("requests")}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
