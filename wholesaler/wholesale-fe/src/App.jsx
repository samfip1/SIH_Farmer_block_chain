import React, { useState, useEffect } from 'react';
import './styles.css';

const sections = [
  { key: 'command', label: 'Command Center', icon: 'fas fa-terminal' },
  { key: 'logistics', label: 'Smart Logistics', icon: 'fas fa-truck' },
  { key: 'inventory', label: 'Inventory Vault', icon: 'fas fa-warehouse' },
  { key: 'trade', label: 'Trade Chronicles', icon: 'fas fa-history' },
  { key: 'growth', label: 'Growth Analytics', icon: 'fas fa-chart-line' },
  { key: 'partner', label: 'Partner Network', icon: 'fas fa-users' },
];

function App() {
  const [activeSection, setActiveSection] = useState('command');
  const [activePartnerTab, setActivePartnerTab] = useState('distributors');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  
  // Search and filter states
  const [mainSearch, setMainSearch] = useState('');
  const [logisticsSearch, setLogisticsSearch] = useState('');
  const [logisticsFilter, setLogisticsFilter] = useState('All Status');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('All Categories');
  const [inventorySort, setInventorySort] = useState('Sort by Name');
  const [tradeSearch, setTradeSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('All Status');
  const [tradeSort, setTradeSort] = useState('All Dates');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerLocationFilter, setPartnerLocationFilter] = useState('All Locations');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState('All Types');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState('All Status');

  // Sample data arrays
  const logisticsData = [
    { id: 'ORD-001', crop: 'Premium Basmati Rice', quantity: '500 kg', partnerId: 'DST-101', status: 'In Transit', price: '₹75/kg', margin: '15%' },
    { id: 'ORD-002', crop: 'Organic Wheat', quantity: '750 kg', partnerId: 'DST-102', status: 'Scheduled', price: '₹45/kg', margin: '12%' },
    { id: 'ORD-003', crop: 'Fresh Tomatoes', quantity: '300 kg', partnerId: 'RTL-301', status: 'Arriving Today', price: '₹35/kg', margin: '20%' },
    { id: 'ORD-004', crop: 'Golden Mangoes', quantity: '200 kg', partnerId: 'WHL-201', status: 'Quality Check', price: '₹120/kg', margin: '18%' },
    { id: 'ORD-005', crop: 'Green Spinach', quantity: '150 kg', partnerId: 'RTL-302', status: 'In Transit', price: '₹25/kg', margin: '25%' },
    { id: 'ORD-006', crop: 'Cardamom', quantity: '50 kg', partnerId: 'WHL-202', status: 'Delivered', price: '₹2500/kg', margin: '10%' }
  ];

  const inventoryData = [
    { id: 'INV-001', name: 'Premium Basmati Rice', stock: '1,200 kg', value: '₹86/kg', productId: 'ORD-001', category: 'Grains', icon: 'rice' },
    { id: 'INV-002', name: 'Organic Wheat', stock: '900 kg', value: '₹50/kg', productId: 'ORD-002', category: 'Grains', icon: 'wheat' },
    { id: 'INV-003', name: 'Fresh Tomatoes', stock: '450 kg', value: '₹42/kg', productId: 'ORD-003', category: 'Vegetables', icon: 'tomato' },
    { id: 'INV-004', name: 'Golden Mangoes', stock: '180 kg', value: '₹142/kg', productId: 'ORD-004', category: 'Fruits', icon: 'mango' },
    { id: 'INV-005', name: 'Green Spinach', stock: '320 kg', value: '₹31/kg', productId: 'ORD-005', category: 'Vegetables', icon: 'spinach' },
    { id: 'INV-006', name: 'Cardamom', stock: '75 kg', value: '₹2750/kg', productId: 'ORD-006', category: 'Spices', icon: 'spice' }
  ];

  const tradeData = [
    { id: 'TRD-001', crop: 'Royal Alphonso Mangoes', quantity: '400 kg', partner: 'RTL-301', status: 'Completed', value: '₹200/kg', margin: '15%', date: '2025-09-15' },
    { id: 'TRD-002', crop: 'Exotic Dragon Fruit', quantity: '100 kg', partner: 'WHL-201', status: 'Completed', value: '₹300/kg', margin: '20%', date: '2025-09-10' },
    { id: 'TRD-003', crop: 'Heritage Cardamom', quantity: '50 kg', partner: 'DST-101', status: 'Completed', value: '₹2500/kg', margin: '12%', date: '2025-09-05' },
    { id: 'TRD-004', crop: 'Organic Turmeric', quantity: '200 kg', partner: 'WHL-202', status: 'Completed', value: '₹180/kg', margin: '18%', date: '2025-09-01' },
    { id: 'TRD-005', crop: 'Premium Saffron', quantity: '2 kg', partner: 'RTL-302', status: 'Processing', value: '₹50000/kg', margin: '25%', date: '2025-09-20' }
  ];

  // Notifications data
  const notificationsData = [
    { id: 1, type: 'delivery', title: 'Delivery Alert', message: 'Fresh Tomatoes shipment arriving in 2 hours', time: '10 min ago', unread: true },
    { id: 2, type: 'payment', title: 'Payment Received', message: 'Payment of ₹85,000 received from Rajesh Stores', time: '1 hour ago', unread: true },
    { id: 3, type: 'inventory', title: 'Low Stock Warning', message: 'Green Spinach stock below minimum threshold', time: '2 hours ago', unread: false },
    { id: 4, type: 'order', title: 'New Order', message: 'Large order placed for Premium Basmati Rice', time: '3 hours ago', unread: false },
    { id: 5, type: 'quality', title: 'Quality Check Complete', message: 'Golden Mangoes passed quality inspection', time: '5 hours ago', unread: false }
  ];

  // Messages data
  const messagesData = [
    { id: 1, sender: 'Farmer Krishna', message: 'The organic wheat harvest is ready for pickup tomorrow morning.', time: '15 min ago', unread: true, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 2, sender: 'Wholesaler Raj', message: 'Can you increase the tomato supply for next week? High demand in local markets.', time: '1 hour ago', unread: true, avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { id: 3, sender: 'Quality Inspector', message: 'Mango quality inspection scheduled for 2 PM today. Please have samples ready.', time: '2 hours ago', unread: false, avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { id: 4, sender: 'Retailer Priya', message: 'Thank you for the excellent spinach quality. Our customers are very satisfied!', time: '1 day ago', unread: false, avatar: 'https://randomuser.me/api/portraits/women/35.jpg' }
  ];

  // Partner data arrays
  const distributorData = [
    { id: 'DST-101', name: 'Regional Distribution Co.', location: 'Delhi NCR', specialty: 'Bulk Food Distribution', rating: 4.8, status: 'Active', orders: 85, revenue: '₹18.5L', type: 'distributor' },
    { id: 'DST-102', name: 'North India Distributors', location: 'Punjab & Haryana', specialty: 'Agricultural Products', rating: 4.9, status: 'Active', orders: 72, revenue: '₹14.7L', type: 'distributor' },
    { id: 'DST-103', name: 'Western Supply Chain', location: 'Maharashtra & Gujarat', specialty: 'Fresh Produce Distribution', rating: 4.6, status: 'Active', orders: 65, revenue: '₹12.3L', type: 'distributor' },
    { id: 'DST-104', name: 'Eastern Gateway Logistics', location: 'West Bengal', specialty: 'Multi-State Distribution', rating: 4.7, status: 'Pending', orders: 45, revenue: '₹8.9L', type: 'distributor' },
    { id: 'DST-105', name: 'South Express Distribution', location: 'Tamil Nadu & Karnataka', specialty: 'Express Delivery', rating: 4.5, status: 'Inactive', orders: 32, revenue: '₹6.2L', type: 'distributor' }
  ];

  const companyData = [
    { id: 'CMP-201', name: 'AgriSupply Corporation', location: 'Mumbai, Maharashtra', specialty: 'Bulk Agricultural Supplies', rating: 4.7, status: 'Active', orders: 125, revenue: '₹28.4L', type: 'company' },
    { id: 'CMP-202', name: 'FarmFresh Suppliers', location: 'Ludhiana, Punjab', specialty: 'Fresh Produce Supply', rating: 4.9, status: 'Active', orders: 89, revenue: '₹22.1L', type: 'company' },
    { id: 'CMP-203', name: 'Organic Harvest Co.', location: 'Bangalore, Karnataka', specialty: 'Organic Product Supply', rating: 4.6, status: 'Active', orders: 67, revenue: '₹15.8L', type: 'company' },
    { id: 'CMP-204', name: 'Central Agri Traders', location: 'Indore, Madhya Pradesh', specialty: 'Mixed Commodity Supply', rating: 4.4, status: 'Pending', orders: 45, revenue: '₹11.2L', type: 'company' }
  ];

  const retailerData = [
    { id: 'RTL-301', name: 'FreshMart Supermarket', location: 'Delhi NCR', specialty: 'Supermarket Chain', rating: 4.8, status: 'Active', orders: 245, revenue: '₹32.7L', type: 'retailer' },
    { id: 'RTL-302', name: 'Organic Bazaar', location: 'Mumbai', specialty: 'Organic Food Retail', rating: 4.9, status: 'Active', orders: 178, revenue: '₹28.2L', type: 'retailer' },
    { id: 'RTL-303', name: 'Village Fresh Stores', location: 'Pune, Maharashtra', specialty: 'Local Retail Chain', rating: 4.5, status: 'Active', orders: 156, revenue: '₹19.4L', type: 'retailer' },
    { id: 'RTL-304', name: 'Green Grocers Network', location: 'Ahmedabad, Gujarat', specialty: 'Organic Retail', rating: 4.7, status: 'Pending', orders: 98, revenue: '₹14.6L', type: 'retailer' },
    { id: 'RTL-305', name: 'Metro Fresh Markets', location: 'Kolkata, West Bengal', specialty: 'Fresh Produce Retail', rating: 4.3, status: 'Inactive', orders: 67, revenue: '₹9.8L', type: 'retailer' }
  ];

  // Filtering functions
  const filteredLogistics = logisticsData.filter(item => {
    const matchesSearch = logisticsSearch === '' || 
      item.crop.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.partnerId.toLowerCase().includes(logisticsSearch.toLowerCase());
    const matchesMainSearch = mainSearch === '' ||
      item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.partnerId.toLowerCase().includes(mainSearch.toLowerCase());
    const matchesFilter = logisticsFilter === 'All Status' || item.status === logisticsFilter;
    return matchesSearch && matchesMainSearch && matchesFilter;
  });

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = inventorySearch === '' || 
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.productId.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesMainSearch = mainSearch === '' ||
      item.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.productId.toLowerCase().includes(mainSearch.toLowerCase());
    const matchesFilter = inventoryFilter === 'All Categories' || item.category === inventoryFilter;
    return matchesSearch && matchesMainSearch && matchesFilter;
  }).sort((a, b) => {
    if (inventorySort === 'Sort by Name') return a.name.localeCompare(b.name);
    if (inventorySort === 'Sort by Stock') return parseInt(b.stock) - parseInt(a.stock);
    if (inventorySort === 'Sort by Value') return parseInt(b.value.replace(/[^\d]/g, '')) - parseInt(a.value.replace(/[^\d]/g, ''));
    return 0;
  });

  const filteredTrade = tradeData.filter(item => {
    const matchesSearch = tradeSearch === '' || 
      item.crop.toLowerCase().includes(tradeSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(tradeSearch.toLowerCase()) ||
      item.partner.toLowerCase().includes(tradeSearch.toLowerCase());
    const matchesMainSearch = mainSearch === '' ||
      item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.partner.toLowerCase().includes(mainSearch.toLowerCase());
    const matchesFilter = tradeFilter === 'All Status' || item.status === tradeFilter;
    return matchesSearch && matchesMainSearch && matchesFilter;
  }).filter(item => {
    if (tradeSort === 'All Dates') return true;
    const itemDate = new Date(item.date);
    const now = new Date();
    if (tradeSort === 'Today') {
      return itemDate.toDateString() === now.toDateString();
    }
    if (tradeSort === 'This Week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return itemDate >= weekAgo;
    }
    if (tradeSort === 'This Month') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
    }
    if (tradeSort === 'Last 3 Months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return itemDate >= threeMonthsAgo;
    }
    return true;
  });

  // Partner filtering functions
  const getActivePartnerData = () => {
    if (activePartnerTab === 'distributors') return distributorData;
    if (activePartnerTab === 'companies') return companyData;
    if (activePartnerTab === 'retailers') return retailerData;
    return [];
  };

  const filteredPartners = getActivePartnerData().filter(partner => {
    const matchesSearch = partnerSearch === '' || 
      partner.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      partner.id.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      partner.location.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      partner.specialty.toLowerCase().includes(partnerSearch.toLowerCase());
    
    const matchesMainSearch = mainSearch === '' ||
      partner.name.toLowerCase().includes(mainSearch.toLowerCase()) ||
      partner.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      partner.location.toLowerCase().includes(mainSearch.toLowerCase()) ||
      partner.specialty.toLowerCase().includes(mainSearch.toLowerCase());
    
    const matchesLocation = partnerLocationFilter === 'All Locations' || 
      partner.location.toLowerCase().includes(partnerLocationFilter.toLowerCase());
    
    return matchesSearch && matchesMainSearch && matchesLocation;
  });

  // Calculate dynamic partner counts and total value
  const getPartnerCounts = () => {
    const activeDistributors = distributorData.filter(p => p.status === 'Active').length;
    const totalDistributors = distributorData.length;
    const activeCompanies = companyData.filter(p => p.status === 'Active').length;
    const totalCompanies = companyData.length;
    const activeRetailers = retailerData.filter(p => p.status === 'Active').length;
    const totalRetailers = retailerData.length;
    
    // Calculate total partnership value from all active partners
    const allActivePartners = [
      ...distributorData.filter(p => p.status === 'Active'),
      ...companyData.filter(p => p.status === 'Active'),
      ...retailerData.filter(p => p.status === 'Active')
    ];
    
    const totalValue = allActivePartners.reduce((sum, partner) => {
      const value = parseFloat(partner.revenue.replace('₹', '').replace('L', ''));
      return sum + value;
    }, 0);
    
    return { 
      distributors: activeDistributors, 
      companies: activeCompanies, 
      retailers: activeRetailers,
      totalDistributors,
      totalCompanies, 
      totalRetailers,
      totalValue: `₹${totalValue.toFixed(1)}L`
    };
  };

  const partnerCounts = getPartnerCounts();

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.topbar-icon')) {
        setShowNotifications(false);
        setShowMessages(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <div>
          <div className="sidebar-header sidebar-header-logo-group">
            <img src="/logo.png" alt="AgriFlow Logo" className="agriflow-logo" />
            <div className="sidebar-header-text">
              <span className="sidebar-header-title">AgriFlow</span>
              <div className="sidebar-subtitle">Wholesaler Hub</div>
            </div>
          </div>
          <nav className="sidebar-menu">
            {sections.map(section => (
              <div
                key={section.key}
                className={`sidebar-menu-item${activeSection === section.key ? ' active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                <i className={section.icon}></i>
                {section.label}
              </div>
            ))}
          </nav>
        </div>
        <div className="sidebar-user-card">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rajesh Kumar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div className="user-info">
            <div className="user-name">Rajesh Kumar</div>
            <div className="user-role">Premium Wholesaler</div>
          </div>
          <span className="edit-btn" onClick={() => setShowProfileModal(true)}>
            <i className="fas fa-edit"></i>
          </span>
        </div>
      </aside>
      <main className="main-content">
        <div className="topbar-row">
          <div className="header-section-inline">
            <div className="header-title">Welcome Back, Rajesh!</div>
            <div className="header-subtitle">Manage your agricultural wholesaler operations with ease</div>
          </div>
          <div className="topbar-inline">
            <input 
              className="search-input" 
              type="text" 
              placeholder="Search products, orders..." 
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
            />
            <span className="topbar-icon" onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowMessages(false);
            }}>
              <i className="fas fa-bell"></i>
              <span className="badge">96</span>
              {showNotifications && (
                <div className="notifications-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    <span className="unread-count">{notificationsData.filter(n => n.unread).length} unread</span>
                  </div>
                  <div className="notifications-list">
                    {notificationsData.map(notification => (
                      <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                        <div className={`notification-icon ${notification.type}`}>
                          <i className={`fas fa-${notification.type === 'delivery' ? 'truck' : notification.type === 'payment' ? 'rupee-sign' : notification.type === 'inventory' ? 'warehouse' : notification.type === 'order' ? 'shopping-cart' : 'check-circle'}`}></i>
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <a href="#" className="view-all-link">View All Notifications</a>
                  </div>
                </div>
              )}
            </span>
            <span className="topbar-icon" onClick={(e) => {
              e.stopPropagation();
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}>
              <i className="fas fa-envelope"></i>
              {showMessages && (
                <div className="messages-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <h3>Messages</h3>
                    <span className="unread-count">{messagesData.filter(m => m.unread).length} unread</span>
                  </div>
                  <div className="messages-list">
                    {messagesData.map(message => (
                      <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                        <img src={message.avatar} alt={message.sender} className="message-avatar" />
                        <div className="message-content">
                          <h4>{message.sender}</h4>
                          <p>{message.message}</p>
                          <span className="message-time">{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <a href="#" className="view-all-link">View All Messages</a>
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>
        {activeSection === 'command' && (
          <section>
            <div className="stats-section">
              <div className="stat-card">
                <div>
                  <div className="stat-title">TOTAL ORDER</div>
                  <div className="stat-number">638</div>
                  <div className="stat-subtitle">Active Orders</div>
                  <div className="stat-change">+12.5% vs last month</div>
                </div>
                <span className="stat-icon green"><i className="fas fa-shopping-cart"></i></span>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-title">SHIPMENT PIPELINE</div>
                  <div className="stat-number">5</div>
                  <div className="stat-subtitle">In Transit</div>
                  <div className="stat-change">+8.2% vs last month</div>
                </div>
                <span className="stat-icon blue"><i className="fas fa-truck"></i></span>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-title">INVENTORY WEALTH</div>
                  <div className="stat-number">₹2.4M</div>
                  <div className="stat-subtitle">Stock Value</div>
                  <div className="stat-change">+15.8% vs last month</div>
                </div>
                <span className="stat-icon purple"><i className="fas fa-boxes"></i></span>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-title">REVENUE STREAM</div>
                  <div className="stat-number">₹8.7M</div>
                  <div className="stat-subtitle">This Month</div>
                  <div className="stat-change">+22.1% vs last month</div>
                </div>
                <span className="stat-icon orange"><i className="fas fa-chart-line"></i></span>
              </div>
            </div>
            <div className="orders-quick-row">
              <div className="orders-section">
                <div className="table-header">
                  <span>Latest Order Activity</span>
                  <span className="view-all-link">View All Orders</span>
                </div>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ORDER DETAILS</th>
                      <th>CUSTOMER</th>
                      <th>VALUE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="table-row">
                      <td>
                        <div className="order-id">ORD-2025-001</div>
                        <div className="order-date">2025-09-07</div>
                      </td>
                      <td className="customer">Fresh Mart Stores</td>
                      <td className="value">₹45,200</td>
                      <td><span className="status-badge processing">Processing</span></td>
                    </tr>
                    <tr className="table-row">
                      <td>
                        <div className="order-id">ORD-2025-002</div>
                        <div className="order-date">2025-09-06</div>
                      </td>
                      <td className="customer">Green Valley Co-op</td>
                      <td className="value">₹32,850</td>
                      <td><span className="status-badge delivered">Delivered</span></td>
                    </tr>
                    <tr className="table-row">
                      <td>
                        <div className="order-id">ORD-2025-003</div>
                        <div className="order-date">2025-09-06</div>
                      </td>
                      <td className="customer">Organic Harvest Ltd</td>
                      <td className="value">₹67,400</td>
                      <td><span className="status-badge transit">In Transit</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="quick-actions">
                <div className="table-header">Quick Actions</div>
                <button className="action-btn primary"><i className="fas fa-plus"></i> Create New Order</button>
                <button className="action-btn secondary"><i className="fas fa-truck"></i> Track Shipment</button>
                <button className="action-btn secondary"><i className="fas fa-box"></i> Update Inventory</button>
                <button className="action-btn secondary"><i className="fas fa-file-alt"></i> Generate Report</button>
              </div>
            </div>
          </section>
        )}
        {activeSection === 'logistics' && (
          <section>
            <div className="logistics-table-card">
              <div className="logistics-header-row">
                <div className="logistics-header-title">Smart Logistics Pipeline</div>
                <div className="logistics-controls">
                  <input 
                    className="logistics-search" 
                    type="text" 
                    placeholder="Search by crop, product ID, farmer..." 
                    value={logisticsSearch}
                    onChange={(e) => setLogisticsSearch(e.target.value)}
                  />
                  <select 
                    className="logistics-filter"
                    value={logisticsFilter}
                    onChange={(e) => setLogisticsFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>In Transit</option>
                    <option>Scheduled</option>
                    <option>Arriving Today</option>
                    <option>Quality Check</option>
                    <option>Delivered</option>
                    <option>Delayed</option>
                    <option>Processing</option>
                    <option>Pickup Ready</option>
                    <option>On Hold</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <table className="logistics-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>PREMIUM CROP</th>
                    <th>QUANTITY</th>
                    <th>PARTNER</th>
                    <th>STATUS</th>
                    <th>MARKET PRICE</th>
                    <th>PROFIT MARGIN</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogistics.map((item) => (
                    <tr key={item.id} className="table-row">
                      <td className="product-id">{item.id}</td>
                      <td className="crop-name">{item.crop}</td>
                      <td className="quantity">{item.quantity}</td>
                      <td className="partner-id">{item.partnerId}</td>
                      <td><span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                      <td className="market-price">{item.price}</td>
                      <td className="profit-margin">{item.margin}</td>
                      <td className="actions-cell">
                        <span className="table-action-btn"><i className="fas fa-eye"></i></span>
                        <span className="table-action-btn"><i className="fas fa-edit"></i></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {activeSection === 'inventory' && (
          <section>
            <div className="inventory-vault-container">
              <div className="inventory-header-row">
                <div className="inventory-header-title">Inventory Vault</div>
                <div className="inventory-controls">
                  <input 
                    className="inventory-search" 
                    type="text" 
                    placeholder="Search by crop, ID, quantity..." 
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                  />
                  <select 
                    className="inventory-filter"
                    value={inventoryFilter}
                    onChange={(e) => setInventoryFilter(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Grains</option>
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Spices</option>
                    <option>Pulses</option>
                    <option>Dairy</option>
                    <option>Organic</option>
                    <option>Processed</option>
                    <option>Seeds</option>
                    <option>Herbs</option>
                  </select>
                  <select 
                    className="inventory-sort"
                    value={inventorySort}
                    onChange={(e) => setInventorySort(e.target.value)}
                  >
                    <option>Sort by Name</option>
                    <option>Sort by Stock</option>
                    <option>Sort by Value</option>
                    <option>Sort by Category</option>
                    <option>Sort by Date Added</option>
                    <option>Low Stock First</option>
                    <option>High Value First</option>
                  </select>
                  <button className="add-product-btn">
                    <i className="fas fa-plus"></i> Add New Product
                  </button>
                </div>
              </div>
              
              <div className="inventory-grid">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="inventory-card">
                    <div className={`product-icon ${item.icon}`}>
                      <i className={`fas fa-${item.icon === 'tomato' ? 'seedling' : item.icon === 'mango' ? 'apple-alt' : item.icon === 'spinach' ? 'leaf' : item.icon === 'wheat' ? 'wheat-awn' : 'seedling'}`}></i>
                    </div>
                    <div className="product-badge">{item.id}</div>
                    <h3 className="product-name">{item.name}</h3>
                    <div className="product-details">
                      <div className="detail-row">
                        <span className="detail-label">Stock Available:</span>
                        <span className="detail-value">{item.stock}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Market Value:</span>
                        <span className="detail-value market-value">{item.value}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Product ID:</span>
                        <span className="detail-value">{item.productId}</span>
                      </div>
                    </div>
                    <div className="product-actions">
                      <button className="action-btn-secondary">
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="action-btn-primary">
                        <i className="fas fa-eye"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        {activeSection === 'trade' && (
          <section>
            <div className="trade-chronicles-container">
              <div className="trade-header-row">
                <div className="trade-header-title">Trade Chronicles</div>
                <div className="trade-controls">
                  <input 
                    className="trade-search" 
                    type="text" 
                    placeholder="Search by crop, farmer, price..." 
                    value={tradeSearch}
                    onChange={(e) => setTradeSearch(e.target.value)}
                  />
                  <select 
                    className="trade-filter"
                    value={tradeFilter}
                    onChange={(e) => setTradeFilter(e.target.value)}
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>In Transit</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                    <option>Delayed</option>
                    <option>Returned</option>
                  </select>
                  <select 
                    className="trade-sort"
                    value={tradeSort}
                    onChange={(e) => setTradeSort(e.target.value)}
                  >
                    <option>All Dates</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>This Year</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              
              <table className="trade-table">
                <thead>
                  <tr>
                    <th>TRADE ID</th>
                    <th>PREMIUM CROP</th>
                    <th>QUANTITY</th>
                    <th>PARTNER</th>
                    <th>STATUS</th>
                    <th>DEAL VALUE</th>
                    <th>PROFIT MARGIN</th>
                    <th>TRADE DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrade.map((item) => (
                    <tr key={item.id} className="trade-table-row">
                      <td className="product-id">{item.id}</td>
                      <td className="premium-crop">{item.crop}</td>
                      <td className="quantity">{item.quantity}</td>
                      <td className="partner-name">{item.partner}</td>
                      <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td className="deal-value">{item.value}</td>
                      <td className="profit-margin">{item.margin}</td>
                      <td className="trade-date">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {activeSection === 'growth' && (
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '18px' }}>Growth Analytics</h2>
            
            {/* Main Charts Section */}
            <div className="growth-main-charts">
              <div className="revenue-chart-container">
                <div className="chart-header">
                  <h3>Revenue Growth Analytics</h3>
                  <div className="chart-badge">
                    <i className="fas fa-chart-line"></i>
                    Monthly Trends
                  </div>
                </div>
                <div className="line-chart">
                  <div className="chart-grid">
                    <div className="y-axis">
                      <span>₹70k</span>
                      <span>₹60k</span>
                      <span>₹50k</span>
                      <span>₹40k</span>
                      <span>₹30k</span>
                      <span>₹20k</span>
                      <span>₹10k</span>
                      <span>₹0k</span>
                    </div>
                    <div className="chart-area">
                      <svg viewBox="0 0 400 200" className="line-svg">
                        <polyline
                          points="20,150 80,120 140,130 200,100 260,110 320,80 380,70"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                        />
                        <circle cx="20" cy="150" r="4" fill="#22c55e" />
                        <circle cx="80" cy="120" r="4" fill="#22c55e" />
                        <circle cx="140" cy="130" r="4" fill="#22c55e" />
                        <circle cx="200" cy="100" r="4" fill="#22c55e" />
                        <circle cx="260" cy="110" r="4" fill="#22c55e" />
                        <circle cx="320" cy="80" r="4" fill="#22c55e" />
                        <circle cx="380" cy="70" r="4" fill="#22c55e" />
                      </svg>
                      <div className="x-axis">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="stat-item">
                    <div className="stat-value green">+22.1%</div>
                    <div className="stat-label">GROWTH RATE</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value blue">₹8.7M</div>
                    <div className="stat-label">THIS MONTH</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value orange">₹115L</div>
                    <div className="stat-label">PEAK MONTH</div>
                  </div>
                </div>
              </div>

              <div className="portfolio-chart-container">
                <div className="chart-header">
                  <h3>Market Portfolio</h3>
                  <div className="chart-badge">
                    <i className="fas fa-chart-pie"></i>
                    Distribution Mix
                  </div>
                </div>
                <div className="donut-chart">
                  <div className="donut-svg-container">
                    <svg viewBox="0 0 200 200" className="donut-svg">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#22c55e" strokeWidth="20" 
                              strokeDasharray="176 502" strokeDashoffset="125" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="20" 
                              strokeDasharray="125 502" strokeDashoffset="-51" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="20" 
                              strokeDasharray="88 502" strokeDashoffset="-176" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#8b5cf6" strokeWidth="20" 
                              strokeDasharray="63 502" strokeDashoffset="-264" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#6b7280" strokeWidth="20" 
                              strokeDasharray="50 502" strokeDashoffset="-327" transform="rotate(-90 100 100)" />
                    </svg>
                  </div>
                </div>
                <div className="portfolio-legend">
                  <div className="legend-item">
                    <div className="legend-dot grains"></div>
                    <span>Grains</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot vegetables"></div>
                    <span>Vegetables</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot fruits"></div>
                    <span>Fruits</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot dairy"></div>
                    <span>Dairy</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot others"></div>
                    <span>Others</span>
                  </div>
                </div>
                <div className="portfolio-highlight">
                  <span className="highlight-text">Premium Grains</span> leading with <span className="highlight-value">35%</span> market share
                </div>
              </div>
            </div>

            {/* KPI Section */}
            <div className="kpi-section">
              <h3>Key Performance Indicators</h3>
              <div className="kpi-cards">
                <div className="kpi-card success">
                  <div className="kpi-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-value">96.8%</div>
                    <div className="kpi-label">Order Fulfillment Rate</div>
                    <div className="kpi-progress">
                      <div className="progress-bar-kpi">
                        <div className="progress-fill-kpi success" style={{width: '96.8%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kpi-card info">
                  <div className="kpi-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-value">2.3</div>
                    <div className="kpi-label">Average Delivery Time (Days)</div>
                    <div className="kpi-progress">
                      <div className="progress-bar-kpi">
                        <div className="progress-fill-kpi info" style={{width: '77%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="kpi-card warning">
                  <div className="kpi-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="kpi-content">
                    <div className="kpi-value">4.8/5</div>
                    <div className="kpi-label">Customer Satisfaction</div>
                    <div className="kpi-progress">
                      <div className="progress-bar-kpi">
                        <div className="progress-fill-kpi warning" style={{width: '96%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="growth-bottom-section">
              <div className="top-products">
                <h3>Top Performing Products</h3>
                <div className="product-list">
                  <div className="product-item">
                    <div className="product-icon">🥭</div>
                    <div className="product-info">
                      <div className="product-name">Alphonso Mangoes</div>
                      <div className="product-details">₹142/kg • 18% margin</div>
                    </div>
                    <div className="product-growth positive">+24% GROWTH</div>
                  </div>
                  <div className="product-item">
                    <div className="product-icon">🌾</div>
                    <div className="product-info">
                      <div className="product-name">Basmati Rice</div>
                      <div className="product-details">₹86/kg • 15% margin</div>
                    </div>
                    <div className="product-growth positive">+18% GROWTH</div>
                  </div>
                </div>
              </div>

              <div className="monthly-summary">
                <h3>Monthly Performance Summary</h3>
                <div className="summary-list">
                  <div className="summary-item">
                    <div className="summary-indicator revenue"></div>
                    <div className="summary-info">
                      <div className="summary-label">Total Revenue</div>
                      <div className="summary-value">₹8.7M</div>
                    </div>
                    <div className="summary-trend">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-indicator orders"></div>
                    <div className="summary-info">
                      <div className="summary-label">Orders Processed</div>
                      <div className="summary-value">287</div>
                    </div>
                    <div className="summary-trend">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-indicator partners"></div>
                    <div className="summary-info">
                      <div className="summary-label">New Partners</div>
                      <div className="summary-value">12</div>
                    </div>
                    <div className="summary-trend">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {activeSection === 'partner' && (
          <section>
            <div className="partner-header">
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '18px' }}>Partner Network</h2>
              <div className="partner-header-controls">
                <div className="partner-search">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search by name, location, specialty..." 
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="partner-location-filter"
                  value={partnerLocationFilter}
                  onChange={(e) => setPartnerLocationFilter(e.target.value)}
                >
                  <option>All Locations</option>
                  <option>Delhi NCR</option>
                  <option>Mumbai</option>
                  <option>Punjab</option>
                  <option>Haryana</option>
                  <option>Maharashtra</option>
                  <option>Gujarat</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>West Bengal</option>
                  <option>Madhya Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Uttar Pradesh</option>
                  <option>Bihar</option>
                  <option>Odisha</option>
                </select>
                <button className="add-partner-btn">
                  <i className="fas fa-plus"></i>
                  Add Partner
                </button>
              </div>
            </div>

            {/* Partner Stats KPIs */}
            <div className="partner-stats-grid">
              <div className="partner-stat-card green">
                <div className="stat-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{partnerCounts.distributors}</div>
                  <div className="stat-label">Active Distributors</div>
                </div>
              </div>
              
              <div className="partner-stat-card blue">
                <div className="stat-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{partnerCounts.companies}</div>
                  <div className="stat-label">Company Partners</div>
                </div>
              </div>
              
              <div className="partner-stat-card purple">
                <div className="stat-icon">
                  <i className="fas fa-store"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{partnerCounts.retailers}</div>
                  <div className="stat-label">Active Retailers</div>
                </div>
              </div>
              
              <div className="partner-stat-card orange">
                <div className="stat-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{partnerCounts.totalValue}</div>
                  <div className="stat-label">Total Partnership Value</div>
                </div>
              </div>
            </div>

            {/* Partner Category Tabs */}
            <div className="partner-tabs">
              <div 
                className={`tab-item ${activePartnerTab === 'distributors' ? 'active' : ''}`}
                onClick={() => setActivePartnerTab('distributors')}
              >
                <i className="fas fa-truck"></i>
                Distributors
              </div>
              <div 
                className={`tab-item ${activePartnerTab === 'companies' ? 'active' : ''}`}
                onClick={() => setActivePartnerTab('companies')}
              >
                <i className="fas fa-building"></i>
                Company Partners
              </div>
              <div 
                className={`tab-item ${activePartnerTab === 'retailers' ? 'active' : ''}`}
                onClick={() => setActivePartnerTab('retailers')}
              >
                <i className="fas fa-store"></i>
                Retailers
              </div>
            </div>

            {/* Partner Cards Grid */}
            <div className="partner-cards-grid">
              {filteredPartners.length === 0 ? (
                <div className="no-partners-message">
                  <i className="fas fa-search"></i>
                  <h3>No partners found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                filteredPartners.map(partner => (
                  <div key={partner.id} className={`partner-card ${partner.type}`}>
                    <div className="partner-card-header">
                      <div className={`partner-avatar ${partner.type}`}>
                        <i className={`fas ${
                          partner.type === 'distributor' ? 'fa-truck' : 
                          partner.type === 'company' ? 'fa-building' : 
                          'fa-store'
                        }`}></i>
                      </div>
                      <div className="partner-info">
                        <h3>{partner.name}</h3>
                        <div className="partner-id">{partner.id}</div>
                      </div>
                      <div className={`partner-status ${partner.status.toLowerCase()}`}>{partner.status}</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{partner.location}</span>
                      </div>
                      <div className="detail-item">
                        <i className={`fas ${
                          partner.type === 'distributor' ? 'fa-boxes' : 
                          partner.type === 'company' ? 'fa-industry' : 
                          'fa-shopping-cart'
                        }`}></i>
                        <span>{partner.specialty}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>{partner.rating} rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">{partner.orders}</div>
                        <div className="metric-label">ORDERS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">{partner.revenue}</div>
                        <div className="metric-label">REVENUE</div>
                      </div>
                    </div>
                    <div className="partner-actions">
                      <button className="action-btn primary">
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                      <button className="action-btn secondary">
                        <i className="fas fa-envelope"></i>
                        Contact
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Profile</h2>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
                  <div className="photo-upload-btn">
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <div className="photo-text">Click to change profile picture</div>
              </div>

              <form className="profile-form">
                <div className="form-group">
                  <label>
                    <i className="fas fa-user"></i>
                    Username
                  </label>
                  <input type="text" value="Rajesh Kumar" />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-envelope"></i>
                    Email Address
                  </label>
                  <input type="email" value="rajesh.kumar@agriflow.com" />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fas fa-phone"></i>
                    Phone Number
                  </label>
                  <input type="tel" value="+91 98765 43210" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-lock"></i>
                      New Password
                    </label>
                    <input type="password" placeholder="Leave blank to keep current password" />
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="fas fa-lock"></i>
                      Confirm Password
                    </label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowProfileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
