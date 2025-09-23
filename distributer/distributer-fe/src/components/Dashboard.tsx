"use client"

import { useState, useEffect } from "react"

const sections = [
  { key: "command", label: "Command Center", icon: "🏢" },
  { key: "logistics", label: "Smart Logistics", icon: "🚛" },
  { key: "inventory", label: "Inventory Vault", icon: "📦" },
  { key: "trade", label: "Trade Chronicles", icon: "📊" },
  { key: "growth", label: "Growth Analytics", icon: "📈" },
  { key: "partner", label: "Partner Network", icon: "🤝" },
]

function Dashboard({ onSignOut, user }: { onSignOut: () => void; user: { username: string } | null }) {
  const [activeSection, setActiveSection] = useState("command")
  const [activePartnerTab, setActivePartnerTab] = useState("farmers")
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

  // Search and filter states
  const [mainSearch, setMainSearch] = useState("")
  const [logisticsSearch, setLogisticsSearch] = useState("")
  const [logisticsFilter, setLogisticsFilter] = useState("All Status")
  const [inventorySearch, setInventorySearch] = useState("")
  const [inventoryFilter, setInventoryFilter] = useState("All Categories")
  const [inventorySort, setInventorySort] = useState("Sort by Name")
  const [tradeSearch, setTradeSearch] = useState("")
  const [tradeFilter, setTradeFilter] = useState("All Status")
  const [tradeSort, setTradeSort] = useState("All Dates")

  // Sample data arrays
  const logisticsData = [
    {
      id: "PRD-001",
      crop: "Premium Basmati Rice",
      quantity: "500 kg",
      farmerId: "FRM-101",
      status: "In Transit",
      price: "₹75/kg",
      margin: "15%",
    },
    {
      id: "PRD-002",
      crop: "Organic Wheat",
      quantity: "750 kg",
      farmerId: "FRM-102",
      status: "Scheduled",
      price: "₹45/kg",
      margin: "12%",
    },
    {
      id: "PRD-003",
      crop: "Fresh Tomatoes",
      quantity: "300 kg",
      farmerId: "FRM-103",
      status: "Arriving Today",
      price: "₹35/kg",
      margin: "20%",
    },
    {
      id: "PRD-004",
      crop: "Golden Mangoes",
      quantity: "200 kg",
      farmerId: "FRM-104",
      status: "Quality Check",
      price: "₹120/kg",
      margin: "18%",
    },
    {
      id: "PRD-005",
      crop: "Green Spinach",
      quantity: "150 kg",
      farmerId: "FRM-105",
      status: "In Transit",
      price: "₹25/kg",
      margin: "25%",
    },
  ]

  const inventoryData = [
    {
      id: "CRP-003",
      name: "Fresh Tomatoes",
      stock: "450 kg",
      value: "₹42/kg",
      productId: "PRD-003",
      category: "Vegetables",
      icon: "🍅",
    },
    {
      id: "CRP-004",
      name: "Golden Mangoes",
      stock: "180 kg",
      value: "₹142/kg",
      productId: "PRD-004",
      category: "Fruits",
      icon: "🥭",
    },
    {
      id: "CRP-005",
      name: "Green Spinach",
      stock: "320 kg",
      value: "₹31/kg",
      productId: "PRD-005",
      category: "Vegetables",
      icon: "🥬",
    },
    {
      id: "CRP-002",
      name: "Organic Wheat",
      stock: "900 kg",
      value: "₹50/kg",
      productId: "PRD-002",
      category: "Grains",
      icon: "🌾",
    },
    {
      id: "CRP-001",
      name: "Premium Basmati Rice",
      stock: "1,200 kg",
      value: "₹86/kg",
      productId: "PRD-001",
      category: "Grains",
      icon: "🌾",
    },
  ]

  const tradeData = [
    {
      id: "PRD-006",
      crop: "Royal Alphonso Mangoes",
      quantity: "400 kg",
      farmer: "FRM-106",
      status: "Completed",
      value: "₹200/kg",
      margin: "15%",
      date: "2025-09-01",
    },
    {
      id: "PRD-007",
      crop: "Exotic Dragon Fruit",
      quantity: "100 kg",
      farmer: "FRM-107",
      status: "Completed",
      value: "₹300/kg",
      margin: "20%",
      date: "2025-08-28",
    },
    {
      id: "PRD-008",
      crop: "Organic Avocados",
      quantity: "250 kg",
      farmer: "FRM-108",
      status: "Completed",
      value: "₹180/kg",
      margin: "18%",
      date: "2025-08-25",
    },
    {
      id: "PRD-009",
      crop: "Premium Cashews",
      quantity: "80 kg",
      farmer: "FRM-109",
      status: "Completed",
      value: "₹800/kg",
      margin: "22%",
      date: "2025-08-20",
    },
    {
      id: "PRD-010",
      crop: "Fresh Coconuts",
      quantity: "600 kg",
      farmer: "FRM-110",
      status: "Completed",
      value: "₹45/kg",
      margin: "16%",
      date: "2025-08-15",
    },
  ]

  interface Farmer {
    id: string
    name: string
    location: string
    crops: string
    rating: number
    orders: number
  }

  interface Buyer {
    id: string
    name: string
    location: string
    category: string
    rating: number
    orders: number
  }

  const partnerData: { farmers: Farmer[]; buyers: Buyer[] } = {
    farmers: [
      { id: "FRM-101", name: "Arjun Patel", location: "Gujarat", crops: "Rice, Wheat", rating: 4.8, orders: 45 },
      { id: "FRM-102", name: "Priya Sharma", location: "Punjab", crops: "Wheat, Corn", rating: 4.9, orders: 52 },
      { id: "FRM-103", name: "Ravi Kumar", location: "Karnataka", crops: "Tomatoes, Onions", rating: 4.7, orders: 38 },
      {
        id: "FRM-104",
        name: "Sunita Devi",
        location: "Maharashtra",
        crops: "Mangoes, Grapes",
        rating: 4.6,
        orders: 41,
      },
      { id: "FRM-105", name: "Vikram Singh", location: "Haryana", crops: "Spinach, Cabbage", rating: 4.8, orders: 47 },
    ],
    buyers: [
      {
        id: "BYR-201",
        name: "Fresh Mart Supermarket",
        location: "Mumbai",
        category: "Retail Chain",
        rating: 4.5,
        orders: 128,
      },
      {
        id: "BYR-202",
        name: "Green Valley Restaurants",
        location: "Delhi",
        category: "Restaurant Group",
        rating: 4.7,
        orders: 95,
      },
      {
        id: "BYR-203",
        name: "Organic Foods Ltd",
        location: "Bangalore",
        category: "Wholesale",
        rating: 4.6,
        orders: 156,
      },
      {
        id: "BYR-204",
        name: "City Fresh Markets",
        location: "Chennai",
        category: "Retail Chain",
        rating: 4.4,
        orders: 89,
      },
      { id: "BYR-205", name: "Premium Grocers", location: "Pune", category: "Premium Retail", rating: 4.8, orders: 73 },
    ],
  }

  // Notifications data
  const notificationsData = [
    {
      id: 1,
      type: "delivery",
      title: "Delivery Alert",
      message: "Fresh Tomatoes shipment arriving in 2 hours",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "Payment of ₹85,000 received from Rajesh Stores",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "inventory",
      title: "Low Stock Warning",
      message: "Green Spinach stock below minimum threshold",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      type: "order",
      title: "New Order",
      message: "Large order placed for Premium Basmati Rice",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 5,
      type: "quality",
      title: "Quality Check Complete",
      message: "Golden Mangoes passed quality inspection",
      time: "5 hours ago",
      unread: false,
    },
  ]

  // Messages data
  const messagesData = [
    {
      id: 1,
      sender: "Farmer Krishna",
      message: "The organic wheat harvest is ready for pickup tomorrow morning.",
      time: "15 min ago",
      unread: true,
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 2,
      sender: "Distributor Raj",
      message: "Can you increase the tomato supply for next week? High demand in local markets.",
      time: "1 hour ago",
      unread: true,
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
      id: 3,
      sender: "Quality Inspector",
      message: "Mango quality inspection scheduled for 2 PM today. Please have samples ready.",
      time: "2 hours ago",
      unread: false,
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      id: 4,
      sender: "Retailer Priya",
      message: "Thank you for the excellent spinach quality. Our customers are very satisfied!",
      time: "1 day ago",
      unread: false,
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
    },
  ]

  // Filtering functions
  const filteredLogistics = logisticsData.filter((item) => {
    const matchesSearch =
      logisticsSearch === "" ||
      item.crop.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(logisticsSearch.toLowerCase())
    const matchesMainSearch =
      mainSearch === "" ||
      item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(mainSearch.toLowerCase())
    const matchesFilter = logisticsFilter === "All Status" || item.status === logisticsFilter
    return matchesSearch && matchesMainSearch && matchesFilter
  })

  const filteredInventory = inventoryData
    .filter((item) => {
      const matchesSearch =
        inventorySearch === "" ||
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.productId.toLowerCase().includes(inventorySearch.toLowerCase())
      const matchesMainSearch =
        mainSearch === "" ||
        item.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
        item.productId.toLowerCase().includes(mainSearch.toLowerCase())
      const matchesFilter = inventoryFilter === "All Categories" || item.category === inventoryFilter
      return matchesSearch && matchesMainSearch && matchesFilter
    })
    .sort((a, b) => {
      if (inventorySort === "Sort by Name") return a.name.localeCompare(b.name)
      if (inventorySort === "Sort by Stock") return Number.parseInt(b.stock) - Number.parseInt(a.stock)
      if (inventorySort === "Sort by Value")
        return Number.parseInt(b.value.replace(/[^\d]/g, "")) - Number.parseInt(a.value.replace(/[^\d]/g, ""))
      return 0
    })

  const filteredTrade = tradeData
    .filter((item) => {
      const matchesSearch =
        tradeSearch === "" ||
        item.crop.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(tradeSearch.toLowerCase()) ||
        item.farmer.toLowerCase().includes(tradeSearch.toLowerCase())
      const matchesMainSearch =
        mainSearch === "" ||
        item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
        item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
        item.farmer.toLowerCase().includes(mainSearch.toLowerCase())
      const matchesFilter = tradeFilter === "All Status" || item.status === tradeFilter
      return matchesSearch && matchesMainSearch && matchesFilter
    })
    .filter((item) => {
      if (tradeSort === "All Dates") return true
      const itemDate = new Date(item.date)
      const now = new Date()
      if (tradeSort === "This Week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return itemDate >= weekAgo
      }
      if (tradeSort === "This Month") {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      }
      if (tradeSort === "Last 3 Months") {
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        return itemDate >= threeMonthsAgo
      }
      return true
    })

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest(".notification-dropdown") && !event.target.closest(".topbar-icon")) {
        setShowNotifications(false)
        setShowMessages(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
      Scheduled: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Arriving Today": "bg-green-100 text-green-800 border-green-200",
      "Quality Check": "bg-purple-100 text-purple-800 border-purple-200",
      Completed: "bg-green-100 text-green-800 border-green-200",
      Processing: "bg-orange-100 text-orange-800 border-orange-200",
      Pending: "bg-gray-100 text-gray-800 border-gray-200",
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles] || statusStyles["Pending"]}`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex-1">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-sidebar-foreground font-bold text-xl">AgriFlow</h1>
                <p className="text-muted text-sm">Distribution Hub</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.key}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeSection === section.key
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent"
                }`}
                onClick={() => setActiveSection(section.key)}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt={user?.username || "User"}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <div className="font-semibold text-card-foreground">{user?.username || "User"}</div>
              <div className="text-muted text-sm">Premium Distributor</div>
            </div>
            <button
              className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
              onClick={() => setShowProfileModal(true)}
            >
              <span className="text-muted">✏️</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground text-balance">
                Welcome Back, {user?.username || "User"}!
              </h1>
              <p className="text-muted mt-1">Manage your agricultural distribution empire with ease</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  className="w-80 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted"
                  type="text"
                  placeholder="Search products, orders..."
                  value={mainSearch}
                  onChange={(e) => setMainSearch(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted">🔍</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="relative p-2 hover:bg-muted/20 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNotifications(!showNotifications)
                    setShowMessages(false)
                  }}
                >
                  <span className="text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <button
                  className="relative p-2 hover:bg-muted/20 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMessages(!showMessages)
                    setShowNotifications(false)
                  }}
                >
                  <span className="text-xl">💬</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                    7
                  </span>
                </button>
              </div>
            </div>
          </div>

          {showNotifications && (
            <div className="absolute right-8 top-20 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 notification-dropdown">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-popover-foreground">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  {
                    title: "New Order Received",
                    message: "Order #ORD-2025-001 from Fresh Mart",
                    time: "2 min ago",
                    type: "success",
                  },
                  {
                    title: "Shipment Delayed",
                    message: "PRD-003 delivery postponed to tomorrow",
                    time: "15 min ago",
                    type: "warning",
                  },
                  {
                    title: "Low Stock Alert",
                    message: "Golden Mangoes running low (< 200kg)",
                    time: "1 hour ago",
                    type: "error",
                  },
                ].map((notification, index) => (
                  <div key={index} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "success"
                            ? "bg-green-500"
                            : notification.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-popover-foreground">{notification.title}</h4>
                        <p className="text-sm text-muted mt-1">{notification.message}</p>
                        <p className="text-xs text-muted mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showMessages && (
            <div className="absolute right-8 top-20 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 notification-dropdown">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-popover-foreground">Messages</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  {
                    name: "Arjun Patel",
                    message: "Rice shipment ready for pickup",
                    time: "5 min ago",
                    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                  },
                  {
                    name: "Fresh Mart",
                    message: "Can we increase tomato order?",
                    time: "20 min ago",
                    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                  },
                  {
                    name: "Priya Sharma",
                    message: "Quality certificates attached",
                    time: "1 hour ago",
                    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
                  },
                ].map((message, index) => (
                  <div key={index} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/5">
                    <div className="flex items-start gap-3">
                      <img
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-popover-foreground">{message.name}</h4>
                        <p className="text-sm text-muted mt-1">{message.message}</p>
                        <p className="text-xs text-muted mt-2">{message.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 p-8">
          {activeSection === "command" && (
            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Orders</div>
                    <div className="text-3xl font-bold text-blue-900 mt-2">638</div>
                    <div className="text-blue-700 text-sm mt-1">Active Orders</div>
                    <div className="text-green-600 text-sm font-medium mt-2">+12.5% vs last month</div>
                  </div>
                  <div className="absolute top-4 right-4 text-blue-500 text-2xl">🛒</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                      Shipment Pipeline
                    </div>
                    <div className="text-3xl font-bold text-green-900 mt-2">5</div>
                    <div className="text-green-700 text-sm mt-1">In Transit</div>
                    <div className="text-green-600 text-sm font-medium mt-2">+8.2% vs last month</div>
                  </div>
                  <div className="absolute top-4 right-4 text-green-500 text-2xl">🚛</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
                      Inventory Wealth
                    </div>
                    <div className="text-3xl font-bold text-purple-900 mt-2">₹2.4M</div>
                    <div className="text-purple-700 text-sm mt-1">Stock Value</div>
                    <div className="text-green-600 text-sm font-medium mt-2">+15.8% vs last month</div>
                  </div>
                  <div className="absolute top-4 right-4 text-purple-500 text-2xl">📦</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Revenue Stream</div>
                    <div className="text-3xl font-bold text-orange-900 mt-2">₹8.7M</div>
                    <div className="text-orange-700 text-sm mt-1">This Month</div>
                    <div className="text-green-600 text-sm font-medium mt-2">+22.1% vs last month</div>
                  </div>
                  <div className="absolute top-4 right-4 text-orange-500 text-2xl">📈</div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-card-foreground">Latest Order Activity</h2>
                    <button className="text-accent hover:text-accent/80 font-medium">View All Orders</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Order Details
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Customer
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Value
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "ORD-2025-001",
                          date: "2025-09-07",
                          customer: "Fresh Mart Supermarket",
                          value: "₹45,000",
                          status: "Processing",
                        },
                        {
                          id: "ORD-2025-002",
                          date: "2025-09-07",
                          customer: "Green Valley Restaurants",
                          value: "₹32,500",
                          status: "Completed",
                        },
                        {
                          id: "ORD-2025-003",
                          date: "2025-09-06",
                          customer: "Organic Foods Ltd",
                          value: "₹67,800",
                          status: "In Transit",
                        },
                        {
                          id: "ORD-2025-004",
                          date: "2025-09-06",
                          customer: "City Fresh Markets",
                          value: "₹28,900",
                          status: "Pending",
                        },
                        {
                          id: "ORD-2025-005",
                          date: "2025-09-05",
                          customer: "Premium Grocers",
                          value: "₹54,200",
                          status: "Completed",
                        },
                      ].map((order, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/5 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-card-foreground">{order.id}</div>
                            <div className="text-sm text-muted">{order.date}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-card-foreground">{order.customer}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-card-foreground">{order.value}</div>
                          </td>
                          <td className="p-4">{getStatusBadge(order.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "logistics" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Smart Logistics</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Add Shipment
                </button>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <input
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      type="text"
                      placeholder="Search shipments..."
                      value={logisticsSearch}
                      onChange={(e) => setLogisticsSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    value={logisticsFilter}
                    onChange={(e) => setLogisticsFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>In Transit</option>
                    <option>Scheduled</option>
                    <option>Arriving Today</option>
                    <option>Quality Check</option>
                  </select>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Product ID
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Crop
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Quantity
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Farmer
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Price
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Margin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {logisticsData.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/5 transition-colors">
                          <td className="p-4 font-mono text-sm text-card-foreground">{item.id}</td>
                          <td className="p-4 font-medium text-card-foreground">{item.crop}</td>
                          <td className="p-4 text-card-foreground">{item.quantity}</td>
                          <td className="p-4 text-card-foreground">{item.farmerId}</td>
                          <td className="p-4">{getStatusBadge(item.status)}</td>
                          <td className="p-4 font-semibold text-card-foreground">{item.price}</td>
                          <td className="p-4 text-green-600 font-medium">{item.margin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "inventory" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Inventory Vault</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Add Product
                </button>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <input
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      type="text"
                      placeholder="Search inventory..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    value={inventoryFilter}
                    onChange={(e) => setInventoryFilter(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                  </select>
                  <select
                    className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    value={inventorySort}
                    onChange={(e) => setInventorySort(e.target.value)}
                  >
                    <option>Sort by Name</option>
                    <option>Sort by Stock</option>
                    <option>Sort by Value</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventoryData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{item.icon}</div>
                      <span className="px-2 py-1 bg-muted/20 text-muted text-xs rounded-full">{item.category}</span>
                    </div>
                    <h3 className="font-bold text-lg text-card-foreground mb-2">{item.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Stock:</span>
                        <span className="font-semibold text-card-foreground">{item.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Value:</span>
                        <span className="font-semibold text-green-600">{item.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Product ID:</span>
                        <span className="font-mono text-sm text-card-foreground">{item.productId}</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/90 transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "trade" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Trade Chronicles</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Export Report
                </button>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <input
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      type="text"
                      placeholder="Search trades..."
                      value={tradeSearch}
                      onChange={(e) => setTradeSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    value={tradeFilter}
                    onChange={(e) => setTradeFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>Pending</option>
                  </select>
                  <select
                    className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    value={tradeSort}
                    onChange={(e) => setTradeSort(e.target.value)}
                  >
                    <option>All Dates</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Product ID
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Crop
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Quantity
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Farmer
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Value
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Margin
                        </th>
                        <th className="text-left p-4 font-semibold text-muted-foreground uppercase text-xs tracking-wide">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeData.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/5 transition-colors">
                          <td className="p-4 font-mono text-sm text-card-foreground">{item.id}</td>
                          <td className="p-4 font-medium text-card-foreground">{item.crop}</td>
                          <td className="p-4 text-card-foreground">{item.quantity}</td>
                          <td className="p-4 text-card-foreground">{item.farmer}</td>
                          <td className="p-4">{getStatusBadge(item.status)}</td>
                          <td className="p-4 font-semibold text-card-foreground">{item.value}</td>
                          <td className="p-4 text-green-600 font-medium">{item.margin}</td>
                          <td className="p-4 text-muted">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeSection === "growth" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Growth Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-indigo-900">Monthly Revenue</h3>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-3xl font-bold text-indigo-900 mb-2">₹8.7M</div>
                  <div className="text-green-600 text-sm font-medium">+22.1% from last month</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-emerald-900">Active Farmers</h3>
                    <span className="text-2xl">👨‍🌾</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-900 mb-2">156</div>
                  <div className="text-green-600 text-sm font-medium">+8 new this month</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-amber-900">Avg. Margin</h3>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="text-3xl font-bold text-amber-900 mb-2">18.5%</div>
                  <div className="text-green-600 text-sm font-medium">+2.3% improvement</div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Performance Trends</h3>
                <div className="h-64 flex items-center justify-center text-muted">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Analytics charts would be integrated here</p>
                    <p className="text-sm">Revenue, Orders, and Growth metrics visualization</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "partner" && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Partner Network</h2>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Add Partner
                </button>
              </div>

              <div className="bg-card rounded-xl border border-border">
                <div className="border-b border-border">
                  <div className="flex">
                    <button
                      className={`px-6 py-4 font-medium transition-colors ${
                        activePartnerTab === "farmers"
                          ? "text-accent border-b-2 border-accent"
                          : "text-muted hover:text-card-foreground"
                      }`}
                      onClick={() => setActivePartnerTab("farmers")}
                    >
                      Farmers (156)
                    </button>
                    <button
                      className={`px-6 py-4 font-medium transition-colors ${
                        activePartnerTab === "buyers"
                          ? "text-accent border-b-2 border-accent"
                          : "text-muted hover:text-card-foreground"
                      }`}
                      onClick={() => setActivePartnerTab("buyers")}
                    >
                      Buyers (89)
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partnerData[activePartnerTab as keyof typeof partnerData].map((partner) => (
                      <div
                        key={partner.id}
                        className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-card-foreground">{partner.name}</h3>
                            <p className="text-sm text-muted">{partner.location}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{partner.rating}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">
                              {activePartnerTab === "farmers" ? "Crops:" : "Category:"}
                            </span>
                            <span className="text-card-foreground">
                              {activePartnerTab === "farmers" ? (partner as Farmer).crops : (partner as Buyer).category}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted">Orders:</span>
                            <span className="font-medium text-card-foreground">{partner.orders}</span>
                          </div>
                        </div>
                        <button className="w-full mt-4 bg-secondary text-secondary-foreground py-2 rounded-lg hover:bg-secondary/90 transition-colors text-sm">
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-popover rounded-xl border border-border p-6 w-80">
            <h3 className="font-semibold text-popover-foreground mb-4">Profile Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/10">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt={user?.username || "User"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-popover-foreground">{user?.username || "User"}</div>
                  <div className="text-sm text-muted">Premium Distributor</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  onClick={() => setShowProfileModal(false)}
                >
                  Edit Profile
                </button>
                <button
                  className="flex-1 p-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  onClick={onSignOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
