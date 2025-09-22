






import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Calendar,
  MapPin,
  Package,
  IndianRupee,
  Send,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Building2,
  TrendingUp,
  Brain,
} from "lucide-react"

interface DistributorRequest {
  id: string
  crop: string
  quantity: number
  unit: string
  priceExpected: number
  distributorId: string
  distributorName: string
  productId: string
  qualityExpected: string
  harvestDate: string
  image: string
  location: string
  status: "pending" | "accepted" | "rejected" | "negotiating"
  requestDate: string
  notes?: string
  distributorResponse?: string
}

interface PricePrediction {
  predicted_price: number
  price_range: {
    lower_bound: number
    upper_bound: number
  }
}

// TODO: Replace with API calls to backend for real distributor requests data
// API endpoints needed:
// - GET /api/distributor-requests - fetch all requests for farmer
// - POST /api/distributor-requests - create new request to distributor
// - PUT /api/distributor-requests/:id - update request status
// - DELETE /api/distributor-requests/:id - cancel request
const mockRequests: DistributorRequest[] = [
  // Mock data - will be replaced with backend API calls
  {
    id: "REQ-001",
    crop: "Tomatoes",
    quantity: 100,
    unit: "kg",
    priceExpected: 45,
    distributorId: "DIST-001",
    distributorName: "Fresh Mart Distributors",
    productId: "PROD-TOM-001",
    qualityExpected: "Grade A - Premium Quality",
    harvestDate: "2024-02-15",
    image: "/fresh-tomatoes.png",
    location: "Green Valley Farm, Maharashtra",
    status: "accepted",
    requestDate: "2024-02-01",
    notes: "Looking for premium quality tomatoes for retail chain",
    distributorResponse: "Accepted! We'll purchase at ₹45/kg. Quality inspection scheduled for Feb 14th.",
  },
  {
    id: "REQ-002",
    crop: "Carrots",
    quantity: 150,
    unit: "kg",
    priceExpected: 35,
    distributorId: "DIST-002",
    distributorName: "Organic Foods Co.",
    productId: "PROD-CAR-002",
    qualityExpected: "Organic Certified",
    harvestDate: "2024-02-20",
    image: "/organic-carrots.png",
    location: "Green Valley Farm, Maharashtra",
    status: "negotiating",
    requestDate: "2024-02-05",
    notes: "Organic certification required",
    distributorResponse: "Interested! Can we negotiate price to ₹32/kg? We need to see organic certificates.",
  },
  {
    id: "REQ-003",
    crop: "Spinach",
    quantity: 50,
    unit: "kg",
    priceExpected: 60,
    distributorId: "DIST-003",
    distributorName: "City Fresh Markets",
    productId: "PROD-SPI-003",
    qualityExpected: "Fresh, No Pesticides",
    harvestDate: "2024-02-25",
    image: "/fresh-spinach.png",
    location: "Green Valley Farm, Maharashtra",
    status: "pending",
    requestDate: "2024-02-08",
    notes: "Pesticide-free spinach, ready for immediate delivery",
  },
]

// TODO: Replace with API call to fetch available distributors
// API endpoint needed: GET /api/distributors - fetch all available distributors
const mockDistributors = [
  // Mock data - will be replaced with backend API call
  { id: "DIST-001", name: "Fresh Mart Distributors", rating: 4.8, location: "Mumbai", speciality: "Retail Chains" },
  { id: "DIST-002", name: "Organic Foods Co.", rating: 4.6, location: "Pune", speciality: "Organic Products" },
  { id: "DIST-003", name: "City Fresh Markets", rating: 4.9, location: "Nashik", speciality: "Local Markets" },
  { id: "DIST-004", name: "Wholesale Vegetables Ltd.", rating: 4.5, location: "Aurangabad", speciality: "Bulk Orders" },
  { id: "DIST-005", name: "Farm Fresh Distributors", rating: 4.7, location: "Nagpur", speciality: "Direct Sales" },
]

export default function DistributorRequests() {
  const [activeTab, setActiveTab] = useState<"requests" | "new">("requests")
  const [requests] = useState<DistributorRequest[]>(mockRequests)
  const [pricePrediction, setPricePrediction] = useState<PricePrediction | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictionError, setPredictionError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    unit: "kg",
    priceExpected: "",
    distributorId: "",
    productId: "",
    harvestDate: "",
    image: "",
    location: "Green Valley Farm, Maharashtra",
    notes: "",
    state: "Maharashtra",
    district: "Pune",
    market: "Pune Market",
    grade: "A - Premium",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

const handleGetPricePrediction = async () => {
  if (!formData.crop || !formData.harvestDate || !formData.state || !formData.district || !formData.market) {
    setPredictionError("Please fill in crop name, harvest date, state, district, and market fields");
    return;
  }

  setIsPredicting(true);
  setPredictionError(null);
  setPricePrediction(null);

  try {
    function toTitleCase(str: string): string {
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    const harvestDate = new Date(formData.harvestDate);
    const formattedDate = `${harvestDate.getDate().toString().padStart(2, "0")}-${(harvestDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${harvestDate.getFullYear()}`;

    console.log("Form Data:", formData);

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        State: toTitleCase(formData.state),
        District: toTitleCase(formData.district),
        Market: toTitleCase(formData.market),
        Commodity: toTitleCase(formData.crop),
        Grade: formData.grade.split(" - ")[0],
        harvest_date: formattedDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Prediction Response:", data);

    setTimeout(() => {
      setPricePrediction(data);
      setIsPredicting(false);
    }, 1500);
  } catch (error) {
    console.error("Error getting price prediction:", error);
    setPredictionError("Failed to get price prediction. Please try again.");
    setIsPredicting(false);
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Replace with actual API call to send request to distributor
    // Example: await fetch('/api/distributor-requests', { method: 'POST', body: JSON.stringify(formData) })
    console.log("Sending request to distributor:", formData)
    setActiveTab("requests")
    // Reset form
    setFormData({
      crop: "",
      quantity: "",
      unit: "kg",
      priceExpected: "",
      distributorId: "",
      productId: "",
      harvestDate: "",
      image: "",
      location: "Green Valley Farm, Maharashtra",
      notes: "",
      state: "Maharashtra",
      district: "Pune",
      market: "Pune Market",
      grade: "A - Premium",
    })
    setPricePrediction(null)
    setPredictionError(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "negotiating":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      case "negotiating":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for distributor response"
      case "accepted":
        return "Distributor accepted your offer"
      case "rejected":
        return "Distributor declined your offer"
      case "negotiating":
        return "Distributor wants to negotiate terms"
      default:
        return "Unknown status"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-800">My Crop Sale Requests</h2>
          <p className="text-green-600">Send requests to distributors to sell your crops and track their responses</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Send className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Total Sent</p>
                    {/* TODO: Connect to backend API for real requests count */}
                    <p className="text-xl font-bold text-green-800">{requests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Awaiting Response</p>
                    {/* TODO: Connect to backend API for real pending requests count */}
                    <p className="text-xl font-bold text-green-800">
                      {requests.filter((r) => r.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Accepted</p>
                    {/* TODO: Connect to backend API for real accepted requests count */}
                    <p className="text-xl font-bold text-green-800">
                      {requests.filter((r) => r.status === "accepted").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Potential Earnings</p>
                    {/* TODO: Connect to backend API for real earnings calculation */}
                    <p className="text-xl font-bold text-green-800">
                      ₹
                      {requests
                        .filter((r) => r.status === "accepted")
                        .reduce((sum, r) => sum + r.quantity * r.priceExpected, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-green-100 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image and Basic Info */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 rounded-lg">
                        <AvatarImage src={request.image || "/placeholder.svg"} className="object-cover" />
                        <AvatarFallback className="bg-green-100 text-green-700 rounded-lg">
                          {request.crop.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-green-800 text-lg">{request.crop}</h3>
                        <p className="text-green-600">{request.qualityExpected}</p>
                        <Badge className={`mt-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <p className="text-xs text-green-500 mt-1">{getStatusDescription(request.status)}</p>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Quantity
                        </p>
                        <p className="font-medium text-green-800">
                          {request.quantity} {request.unit}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          Expected Price
                        </p>
                        <p className="font-medium text-green-800">
                          ₹{request.priceExpected}/{request.unit}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Harvest Date
                        </p>
                        <p className="font-medium text-green-800">
                          {new Date(request.harvestDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-green-600">Total Value</p>
                        <p className="font-bold text-green-800 text-lg">
                          ₹{(request.quantity * request.priceExpected).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Distributor and Location Info */}
                  <div className="mt-4 pt-4 border-t border-green-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">Sent to:</span> {request.distributorName}
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
                    {request.distributorResponse && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-700">Distributor Response:</p>
                        <p className="text-sm text-green-600 mt-1">{request.distributorResponse}</p>
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
            <CardTitle className="text-green-800">Send Crop Sale Request to Distributor</CardTitle>
            <p className="text-green-600 text-sm">
              Fill out the details below to send a request to a distributor for purchasing your crops
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crop Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">Your Crop Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="crop" className="text-green-700">
                      Crop Name *
                    </Label>
                    <Input
                      id="crop"
                      name="crop"
                      value={formData.crop}
                      onChange={handleInputChange}
                      placeholder="e.g., Tomatoes, Carrots, Spinach"
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-green-700">
                        Quantity *
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="100"
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit" className="text-green-700">
                        Unit *
                      </Label>
                      <select
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                        required
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="tons">Tons</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceExpected" className="text-green-700">
                      Expected Price per Unit (₹) *
                    </Label>
                    <Input
                      id="priceExpected"
                      name="priceExpected"
                      type="number"
                      value={formData.priceExpected}
                      onChange={handleInputChange}
                      placeholder="45"
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="harvestDate" className="text-green-700">
                      Harvest Date *
                    </Label>
                    <Input
                      id="harvestDate"
                      name="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={handleInputChange}
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-green-700">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district" className="text-green-700">
                        District *
                      </Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Pune"
                        className="border-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="market" className="text-green-700">
                      Market *
                    </Label>
                    <Input
                      id="market"
                      name="market"
                      value={formData.market}
                      onChange={handleInputChange}
                      placeholder="Pune Market"
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-blue-800">AI Price Prediction</h4>
                      <Button
                        type="button"
                        onClick={handleGetPricePrediction}
                        disabled={isPredicting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {isPredicting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Predicting...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            Get Price Prediction
                          </>
                        )}
                      </Button>
                    </div>

                    {predictionError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{predictionError}</p>
                      </div>
                    )}

                    {pricePrediction && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-white rounded-md border border-blue-200">
                            <p className="text-xs text-blue-600">Lower Range</p>
                            <p className="font-bold text-blue-800">₹{pricePrediction.price_range.lower_bound}</p>
                          </div>
                          <div className="text-center p-3 bg-blue-100 rounded-md border border-blue-300">
                            <p className="text-xs text-blue-600">Predicted Price</p>
                            <p className="font-bold text-blue-800">₹{pricePrediction.predicted_price}</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-md border border-blue-200">
                            <p className="text-xs text-blue-600">Upper Range</p>
                            <p className="font-bold text-blue-800">₹{pricePrediction.price_range.upper_bound}</p>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 text-center">
                          Expected price range: ₹{pricePrediction.price_range.lower_bound} - ₹
                          {pricePrediction.price_range.upper_bound} per {formData.unit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Distributor and Quality Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-800">Distributor Selection</h3>

                  <div className="space-y-2">
                    <Label htmlFor="distributorId" className="text-green-700">
                      Choose Distributor to Send Request *
                    </Label>
                    <select
                      id="distributorId"
                      name="distributorId"
                      value={formData.distributorId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select a distributor to contact</option>
                      {mockDistributors.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.name} - {distributor.location} (★ {distributor.rating}) -{" "}
                          {distributor.speciality}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-green-500">Choose the distributor you want to sell your crops to</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productId" className="text-green-700">
                      Product ID
                    </Label>
                    <Input
                      id="productId"
                      name="productId"
                      value={formData.productId}
                      onChange={handleInputChange}
                      placeholder="PROD-TOM-001"
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-green-700">
                      Quality Grade *
                    </Label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="FAQ">FAQ</option>
                      <option value="Large">Large</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-green-700">
                      Farm Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="border-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-green-700">
                      Product Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
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
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-green-700">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information about your crop or special requirements..."
                  className="border-green-200 focus:border-green-500"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Request to Distributor
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
