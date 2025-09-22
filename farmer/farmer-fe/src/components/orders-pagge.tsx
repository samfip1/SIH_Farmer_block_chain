"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  Calendar,
  MapPin,
  Package,
  IndianRupee,
  Search,
  Eye,
  Plus,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface Order {
  id: string
  harvestDate: string
  image: string
  name: string
  variety: string
  quantity: number
  unit: string
  pricePerUnit: number
  location: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  buyerName: string
}

// // TODO: Replace with API calls to backend for real orders data
// // API endpoints needed:
// // - GET /api/orders - fetch all orders for farmer
// // - POST /api/orders - create new order
// // - PUT /api/orders/:id - update order status
// // - DELETE /api/orders/:id - cancel order
// const mockOrders: Order[] = [
//   {
//     id: "ORD-001",
//     harvestDate: "2024-01-15",
//     image: "/fresh-tomatoes.png",
//     name: "Tomatoes",
//     variety: "Cherry Tomatoes",
//     quantity: 50,
//     unit: "kg",
//     pricePerUnit: 45,
//     location: "Green Valley Farm, Maharashtra",
//     status: "delivered",
//     orderDate: "2024-01-10",
//     buyerName: "Fresh Mart Distributors",
//   },
//   {
//     id: "ORD-002",
//     harvestDate: "2024-01-20",
//     image: "/organic-carrots.png",
//     name: "Carrots",
//     variety: "Organic Carrots",
//     quantity: 75,
//     unit: "kg",
//     pricePerUnit: 35,
//     location: "Green Valley Farm, Maharashtra",
//     status: "shipped",
//     orderDate: "2024-01-18",
//     buyerName: "Organic Foods Co.",
//   },
//   {
//     id: "ORD-003",
//     harvestDate: "2024-01-25",
//     image: "/fresh-spinach.png",
//     name: "Spinach",
//     variety: "Baby Spinach",
//     quantity: 30,
//     unit: "kg",
//     pricePerUnit: 60,
//     location: "Green Valley Farm, Maharashtra",
//     status: "confirmed",
//     orderDate: "2024-01-22",
//     buyerName: "City Fresh Markets",
//   },
//   {
//     id: "ORD-004",
//     harvestDate: "2024-02-01",
//     image: "/fresh-potatoes.png",
//     name: "Potatoes",
//     variety: "Red Potatoes",
//     quantity: 100,
//     unit: "kg",
//     pricePerUnit: 25,
//     location: "Green Valley Farm, Maharashtra",
//     status: "pending",
//     orderDate: "2024-01-28",
//     buyerName: "Wholesale Vegetables Ltd.",
//   },
//   {
//     id: "ORD-005",
//     harvestDate: "2024-02-05",
//     image: "/fresh-onions.png",
//     name: "Onions",
//     variety: "Red Onions",
//     quantity: 80,
//     unit: "kg",
//     pricePerUnit: 30,
//     location: "Green Valley Farm, Maharashtra",
//     status: "pending",
//     orderDate: "2024-02-01",
//     buyerName: "Farm Fresh Distributors",
//   },
// ]

// export default function OrdersPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [orders] = useState<Order[]>(mockOrders)

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || order.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Clock className="h-4 w-4" />
//       case "confirmed":
//         return <CheckCircle className="h-4 w-4" />
//       case "shipped":
//         return <Truck className="h-4 w-4" />
//       case "delivered":
//         return <CheckCircle className="h-4 w-4" />
//       case "cancelled":
//         return <AlertCircle className="h-4 w-4" />
//       default:
//         return <Clock className="h-4 w-4" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-700 border-yellow-200"
//       case "confirmed":
//         return "bg-blue-100 text-blue-700 border-blue-200"
//       case "shipped":
//         return "bg-purple-100 text-purple-700 border-purple-200"
//       case "delivered":
//         return "bg-green-100 text-green-700 border-green-200"
//       case "cancelled":
//         return "bg-red-100 text-red-700 border-red-200"
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200"
//     }
//   }

//   const totalEarnings = orders
//     .filter((order) => order.status === "delivered")
//     .reduce((sum, order) => sum + order.quantity * order.pricePerUnit, 0)

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-green-800">Orders Management</h2>
//           <p className="text-green-600">Track and manage your crop orders</p>
//         </div>
//         <Button className="bg-green-600 hover:bg-green-700">
//           <Plus className="h-4 w-4 mr-2" />
//           Add New Order
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="border-green-100 bg-green-50/50">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Package className="h-5 w-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-green-600">Total Orders</p>
//                 {/* TODO: Connect to backend API for real orders count */}
//                 <p className="text-xl font-bold text-green-800">{orders.length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-green-100 bg-green-50/50">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Clock className="h-5 w-5 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-green-600">Pending</p>
//                 {/* TODO: Connect to backend API for real pending orders count */}
//                 <p className="text-xl font-bold text-green-800">
//                   {orders.filter((o) => o.status === "pending").length}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-green-100 bg-green-50/50">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <Truck className="h-5 w-5 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-green-600">Shipped</p>
//                 {/* TODO: Connect to backend API for real shipped orders count */}
//                 <p className="text-xl font-bold text-green-800">
//                   {orders.filter((o) => o.status === "shipped").length}
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-green-100 bg-green-50/50">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <IndianRupee className="h-5 w-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-green-600">Total Earned</p>
//                 {/* TODO: Connect to backend API for real earnings calculation */}
//                 <p className="text-xl font-bold text-green-800">₹{totalEarnings.toLocaleString()}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <Card className="border-green-100">
//         <CardContent className="p-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
//                 <Input
//                   placeholder="Search orders by crop name, variety, or buyer..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 border-green-200 focus:border-green-500"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="shipped">Shipped</option>
//                 <option value="delivered">Delivered</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Orders List */}
//       <div className="space-y-4">
//         {filteredOrders.map((order) => (
//           <Card key={order.id} className="border-green-100 hover:shadow-md transition-shadow">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Product Image and Basic Info */}
//                 <div className="flex items-center gap-4">
//                   <Avatar className="h-20 w-20 rounded-lg">
//                     <AvatarImage src={order.image || "/placeholder.svg"} className="object-cover" />
//                     <AvatarFallback className="bg-green-100 text-green-700 rounded-lg">
//                       {order.name.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <h3 className="font-semibold text-green-800 text-lg">{order.name}</h3>
//                     <p className="text-green-600">{order.variety}</p>
//                     <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
//                       {getStatusIcon(order.status)}
//                       <span className="ml-1 capitalize">{order.status}</span>
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Order Details */}
//                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm text-green-600 flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       Harvest Date
//                     </p>
//                     <p className="font-medium text-green-800">{new Date(order.harvestDate).toLocaleDateString()}</p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-green-600 flex items-center gap-1">
//                       <Package className="h-4 w-4" />
//                       Quantity
//                     </p>
//                     <p className="font-medium text-green-800">
//                       {order.quantity} {order.unit}
//                     </p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-green-600 flex items-center gap-1">
//                       <IndianRupee className="h-4 w-4" />
//                       Price/Unit
//                     </p>
//                     <p className="font-medium text-green-800">
//                       ₹{order.pricePerUnit}/{order.unit}
//                     </p>
//                   </div>

//                   <div className="space-y-1">
//                     <p className="text-sm text-green-600">Total Value</p>
//                     <p className="font-bold text-green-800 text-lg">
//                       ₹{(order.quantity * order.pricePerUnit).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
//                   >
//                     <Eye className="h-4 w-4 mr-2" />
//                     View Details
//                   </Button>
//                 </div>
//               </div>

//               {/* Location and Buyer Info */}
//               <div className="mt-4 pt-4 border-t border-green-100">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                   <div className="flex items-center gap-2 text-sm text-green-600">
//                     <MapPin className="h-4 w-4" />
//                     <span>{order.location}</span>
//                   </div>
//                   <div className="text-sm text-green-600">
//                     <span className="font-medium">Buyer:</span> {order.buyerName}
//                   </div>
//                   <div className="text-sm text-green-600">
//                     <span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredOrders.length === 0 && (
//         <Card className="border-green-100">
//           <CardContent className="p-8 text-center">
//             <Package className="h-12 w-12 text-green-300 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-green-800 mb-2">No orders found</h3>
//             <p className="text-green-600">
//               {searchTerm || statusFilter !== "all"
//                 ? "Try adjusting your search or filter criteria"
//                 : "You haven't created any orders yet. Start by adding your first order!"}
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }





// TODO: Replace with API calls to backend for real orders data
// API endpoints needed:
// - GET /api/orders - fetch all orders for farmer
// - POST /api/orders - create new order
// - PUT /api/orders/:id - update order status
// - DELETE /api/orders/:id - cancel order
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    harvestDate: "2024-01-15",
    image: "/fresh-tomatoes.png",
    name: "Tomatoes",
    variety: "Cherry Tomatoes",
    quantity: 50,
    unit: "kg",
    pricePerUnit: 45,
    location: "Green Valley Farm, Maharashtra",
    status: "delivered",
    orderDate: "2024-01-10",
    buyerName: "Fresh Mart Distributors",
  },
  {
    id: "ORD-002",
    harvestDate: "2024-01-20",
    image: "/organic-carrots.png",
    name: "Carrots",
    variety: "Organic Carrots",
    quantity: 75,
    unit: "kg",
    pricePerUnit: 35,
    location: "Green Valley Farm, Maharashtra",
    status: "shipped",
    orderDate: "2024-01-18",
    buyerName: "Organic Foods Co.",
  },
  {
    id: "ORD-003",
    harvestDate: "2024-01-25",
    image: "/fresh-spinach.png",
    name: "Spinach",
    variety: "Baby Spinach",
    quantity: 30,
    unit: "kg",
    pricePerUnit: 60,
    location: "Green Valley Farm, Maharashtra",
    status: "confirmed",
    orderDate: "2024-01-22",
    buyerName: "City Fresh Markets",
  },
  {
    id: "ORD-004",
    harvestDate: "2024-02-01",
    image: "/fresh-potatoes.png",
    name: "Potatoes",
    variety: "Red Potatoes",
    quantity: 100,
    unit: "kg",
    pricePerUnit: 25,
    location: "Green Valley Farm, Maharashtra",
    status: "pending",
    orderDate: "2024-01-28",
    buyerName: "Wholesale Vegetables Ltd.",
  },
  {
    id: "ORD-005",
    harvestDate: "2024-02-05",
    image: "/fresh-onions.png",
    name: "Onions",
    variety: "Red Onions",
    quantity: 80,
    unit: "kg",
    pricePerUnit: 30,
    location: "Green Valley Farm, Maharashtra",
    status: "pending",
    orderDate: "2024-02-01",
    buyerName: "Farm Fresh Distributors",
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [orders] = useState<Order[]>(mockOrders)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const totalEarnings = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.quantity * order.pricePerUnit, 0)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Orders Management</h2>
          <p className="text-green-600">Track and manage your crop orders</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total Orders</p>
                {/* TODO: Connect to backend API for real orders count */}
                <p className="text-xl font-bold text-green-800">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Pending</p>
                {/* TODO: Connect to backend API for real pending orders count */}
                <p className="text-xl font-bold text-green-800">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Shipped</p>
                {/* TODO: Connect to backend API for real shipped orders count */}
                <p className="text-xl font-bold text-green-800">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total Earned</p>
                {/* TODO: Connect to backend API for real earnings calculation */}
                <p className="text-xl font-bold text-green-800">₹{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-green-100">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                <Input
                  placeholder="Search orders by crop name, variety, or buyer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-green-100 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image and Basic Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 rounded-lg">
                    <AvatarImage src={order.image || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="bg-green-100 text-green-700 rounded-lg">
                      {order.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg">{order.name}</h3>
                    <p className="text-green-600">{order.variety}</p>
                    <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Harvest Date
                    </p>
                    <p className="font-medium text-green-800">{new Date(order.harvestDate).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Quantity
                    </p>
                    <p className="font-medium text-green-800">
                      {order.quantity} {order.unit}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      Price/Unit
                    </p>
                    <p className="font-medium text-green-800">
                      ₹{order.pricePerUnit}/{order.unit}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-green-600">Total Value</p>
                    <p className="font-bold text-green-800 text-lg">
                      ₹{(order.quantity * order.pricePerUnit).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              {/* Location and Buyer Info */}
              <div className="mt-4 pt-4 border-t border-green-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <MapPin className="h-4 w-4" />
                    <span>{order.location}</span>
                  </div>
                  <div className="text-sm text-green-600">
                    <span className="font-medium">Buyer:</span> {order.buyerName}
                  </div>
                  <div className="text-sm text-green-600">
                    <span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="border-green-100">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">No orders found</h3>
            <p className="text-green-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't created any orders yet. Start by adding your first order!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
