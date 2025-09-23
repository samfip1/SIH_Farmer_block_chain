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

  // Sample data arrays
  const logisticsData = [
    { id: 'PRD-001', crop: 'Premium Basmati Rice', quantity: '500 kg', farmerId: 'FRM-101', status: 'In Transit', price: '₹75/kg', margin: '15%' },
    { id: 'PRD-002', crop: 'Organic Wheat', quantity: '750 kg', farmerId: 'FRM-102', status: 'Scheduled', price: '₹45/kg', margin: '12%' },
    { id: 'PRD-003', crop: 'Fresh Tomatoes', quantity: '300 kg', farmerId: 'FRM-103', status: 'Arriving Today', price: '₹35/kg', margin: '20%' },
    { id: 'PRD-004', crop: 'Golden Mangoes', quantity: '200 kg', farmerId: 'FRM-104', status: 'Quality Check', price: '₹120/kg', margin: '18%' },
    { id: 'PRD-005', crop: 'Green Spinach', quantity: '150 kg', farmerId: 'FRM-105', status: 'In Transit', price: '₹25/kg', margin: '25%' }
  ];

  const inventoryData = [
    { id: 'CRP-003', name: 'Fresh Tomatoes', stock: '450 kg', value: '₹42/kg', productId: 'PRD-003', category: 'Vegetables', icon: 'tomato' },
    { id: 'CRP-004', name: 'Golden Mangoes', stock: '180 kg', value: '₹142/kg', productId: 'PRD-004', category: 'Fruits', icon: 'mango' },
    { id: 'CRP-005', name: 'Green Spinach', stock: '320 kg', value: '₹31/kg', productId: 'PRD-005', category: 'Vegetables', icon: 'spinach' },
    { id: 'CRP-002', name: 'Organic Wheat', stock: '900 kg', value: '₹50/kg', productId: 'PRD-002', category: 'Grains', icon: 'wheat' },
    { id: 'CRP-001', name: 'Premium Basmati Rice', stock: '1,200 kg', value: '₹86/kg', productId: 'PRD-001', category: 'Grains', icon: 'rice' }
  ];

  const tradeData = [
    { id: 'PRD-006', crop: 'Royal Alphonso Mangoes', quantity: '400 kg', farmer: 'FRM-106', status: 'Completed', value: '₹200/kg', margin: '15%', date: '2025-09-01' },
    { id: 'PRD-007', crop: 'Exotic Dragon Fruit', quantity: '100 kg', farmer: 'FRM-107', status: 'Completed', value: '₹300/kg', margin: '20%', date: '2025-08-28' },
    { id: 'PRD-008', crop: 'Heritage Cardamom', quantity: '50 kg', farmer: 'FRM-108', status: 'Completed', value: '₹2500/kg', margin: '12%', date: '2025-08-25' }
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
    { id: 2, sender: 'Retailer Raj', message: 'Can you increase the tomato supply for next week? High demand in local markets.', time: '1 hour ago', unread: true, avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { id: 3, sender: 'Quality Inspector', message: 'Mango quality inspection scheduled for 2 PM today. Please have samples ready.', time: '2 hours ago', unread: false, avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { id: 4, sender: 'Retailer Priya', message: 'Thank you for the excellent spinach quality. Our customers are very satisfied!', time: '1 day ago', unread: false, avatar: 'https://randomuser.me/api/portraits/women/35.jpg' }
  ];

  // Filtering functions
  const filteredLogistics = logisticsData.filter(item => {
    const matchesSearch = logisticsSearch === '' || 
      item.crop.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(logisticsSearch.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(logisticsSearch.toLowerCase());
    const matchesMainSearch = mainSearch === '' ||
      item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.farmerId.toLowerCase().includes(mainSearch.toLowerCase());
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
      item.farmer.toLowerCase().includes(tradeSearch.toLowerCase());
    const matchesMainSearch = mainSearch === '' ||
      item.crop.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(mainSearch.toLowerCase()) ||
      item.farmer.toLowerCase().includes(mainSearch.toLowerCase());
    const matchesFilter = tradeFilter === 'All Status' || item.status === tradeFilter;
    return matchesSearch && matchesMainSearch && matchesFilter;
  }).filter(item => {
    if (tradeSort === 'All Dates') return true;
    const itemDate = new Date(item.date);
    const now = new Date();
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
              <div className="sidebar-subtitle">Wholesale Hub</div>
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
            <div className="header-subtitle">Manage your agricultural wholesale business with ease</div>
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
                <span className="stat-icon blue"><i className="fas fa-shopping-cart"></i></span>
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
                  </select>
                </div>
              </div>
              <table className="logistics-table">
                <thead>
                  <tr>
                    <th>PRODUCT DETAILS</th>
                    <th>PREMIUM CROP</th>
                    <th>QUANTITY</th>
                    <th>PARTNER FARMER</th>
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
                      <td className="farmer-id">{item.farmerId}</td>
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
                  </select>
                  <select 
                    className="inventory-sort"
                    value={inventorySort}
                    onChange={(e) => setInventorySort(e.target.value)}
                  >
                    <option>Sort by Name</option>
                    <option>Sort by Stock</option>
                    <option>Sort by Value</option>
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
                  </select>
                  <select 
                    className="trade-sort"
                    value={tradeSort}
                    onChange={(e) => setTradeSort(e.target.value)}
                  >
                    <option>All Dates</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
              </div>
              
              <table className="trade-table">
                <thead>
                  <tr>
                    <th>PRODUCT ID</th>
                    <th>PREMIUM CROP</th>
                    <th>QUANTITY</th>
                    <th>FARMER PARTNER</th>
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
                      <td className="farmer-partner">{item.farmer}</td>
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
                    <div className="stat-value blue">+22.1%</div>
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
                    Wholesale Mix
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
                  <input type="text" placeholder="Search by name, location, specialty..." />
                </div>
                <select className="partner-location-filter">
                  <option>All Locations</option>
                  <option>Himachal Pradesh</option>
                  <option>Punjab</option>
                  <option>Maharashtra</option>
                </select>
                <button className="add-partner-btn">
                  <i className="fas fa-plus"></i>
                  Add Partner
                </button>
              </div>
            </div>

            {/* Partner Stats KPIs */}
            <div className="partner-stats-grid">
              <div className="partner-stat-card teal">
                <div className="stat-icon">
                  <i className="fas fa-seedling"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">4</div>
                  <div className="stat-label">Active Farmers</div>
                </div>
              </div>
              
              <div className="partner-stat-card blue">
                <div className="stat-icon">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Wholesale Partners</div>
                </div>
              </div>
              
              <div className="partner-stat-card purple">
                <div className="stat-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Wholesale Partners</div>
                </div>
              </div>
              
              <div className="partner-stat-card orange">
                <div className="stat-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">₹42.7L</div>
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
                className={`tab-item ${activePartnerTab === 'company' ? 'active' : ''}`}
                onClick={() => setActivePartnerTab('company')}
              >
                <i className="fas fa-building"></i>
                Company Partners
              </div>
              <div 
                className={`tab-item ${activePartnerTab === 'retailer' ? 'active' : ''}`}
                onClick={() => setActivePartnerTab('retailer')}
              >
                <i className="fas fa-store"></i>
                Retailer Partners
              </div>
            </div>

            {/* Partner Cards Grid */}
            <div className="partner-cards-grid">
              {/* Distributors */}
              {activePartnerTab === 'distributors' && (
                <>
                  <div className="partner-card distributors">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-leaf"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Rajesh Patel</h3>
                        <div className="partner-id">FRM-101</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Himachal Pradesh</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-seedling"></i>
                        <span>Premium Basmati Rice</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.8 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">45</div>
                        <div className="metric-label">DEALS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹12.5L</div>
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

                  <div className="partner-card distributors">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-truck"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Priya Sharma</h3>
                        <div className="partner-id">FRM-102</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Punjab</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-seedling"></i>
                        <span>Organic Wheat</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.9 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">38</div>
                        <div className="metric-label">DEALS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹8.7L</div>
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

                  <div className="partner-card distributors">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-truck"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Mohammed Ali</h3>
                        <div className="partner-id">FRM-103</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Maharashtra</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-seedling"></i>
                        <span>Fresh Tomatoes</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.6 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">52</div>
                        <div className="metric-label">DEALS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹6.3L</div>
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
                </>
              )}

              {/* Company Partners */}
              {activePartnerTab === 'company' && (
                <>
                  <div className="partner-card company">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Tech Corp Solutions</h3>
                        <div className="partner-id">CMP-201</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Mumbai, Maharashtra</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-boxes"></i>
                        <span>Bulk Groceries</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.7 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">125</div>
                        <div className="metric-label">ORDERS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹28.4L</div>
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

                  <div className="partner-card company">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Punjab Grain Traders</h3>
                        <div className="partner-id">WHL-202</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Ludhiana, Punjab</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-boxes"></i>
                        <span>Rice & Wheat</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.9 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">89</div>
                        <div className="metric-label">ORDERS</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹22.1L</div>
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
                </>
              )}

              {/* Retailer Partners */}
              {activePartnerTab === 'retailer' && (
                <>
                  <div className="partner-card retailer">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-store"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Retail Express Chain</h3>
                        <div className="partner-id">RTL-301</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Delhi NCR</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-shipping-fast"></i>
                        <span>Express Delivery</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.8 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">156</div>
                        <div className="metric-label">DELIVERIES</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹15.7L</div>
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

                  <div className="partner-card retailer">
                    <div className="partner-card-header">
                      <div className="partner-avatar">
                        <i className="fas fa-store"></i>
                      </div>
                      <div className="partner-info">
                        <h3>Rural Connect Transport</h3>
                        <div className="partner-id">DST-302</div>
                      </div>
                      <div className="partner-status active">Active</div>
                    </div>
                    <div className="partner-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Rajasthan</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-shipping-fast"></i>
                        <span>Rural wholesale</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>4.5 rating</span>
                      </div>
                    </div>
                    <div className="partner-metrics">
                      <div className="metric">
                        <div className="metric-value">98</div>
                        <div className="metric-label">DELIVERIES</div>
                      </div>
                      <div className="metric">
                        <div className="metric-value">₹11.2L</div>
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
                </>
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
