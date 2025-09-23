import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-green-700">Company Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={signOut}
                className="px-3 py-1 text-sm text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Section 1: Incoming Requests from Wholesalers/Retailers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Incoming Requests</h2>
            <div className="space-y-4">
              {/* Example Request */}
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="font-medium text-gray-700">Request from: <span className="font-bold">Wholesaler A</span></p>
                <p className="text-sm text-gray-600">Product: <span className="font-semibold">Potato Chips (1000 packets)</span></p>
                <div className="mt-2 space-x-2">
                  <button className="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600">Accept</button>
                  <button className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600">Decline</button>
                </div>
              </div>
              {/* Add more requests here */}
            </div>
          </div>

          {/* Section 2: Send Request to Distributor */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Send Request to Distributor</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="distributor" className="block text-sm font-medium text-gray-700">Select Distributor</label>
                <select id="distributor" className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                  <option>Distributor X (Grains Specialist)</option>
                  <option>Distributor Y (Vegetable Supplier)</option>
                </select>
              </div>
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product Needed</label>
                <input type="text" id="product" placeholder="e.g., Potatoes" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="text" id="quantity" placeholder="e.g., 500 kg" className="w-full mt-1 p-2 border border-gray-300 rounded-md"/>
              </div>
              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Send Request
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}