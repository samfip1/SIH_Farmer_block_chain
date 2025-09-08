"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { User, MapPin, Phone, Lock, Camera, Save, Edit3 } from "lucide-react"

interface ProfileSettingsProps {
  user: any
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)

  // TODO: Replace with API calls to backend for real user profile data
  // API endpoints needed:
  // - GET /api/user/profile - fetch user profile
  // - PUT /api/user/profile - update user profile
  // - PUT /api/user/password - update user password
  const [formData, setFormData] = useState({
    name: user?.name || "John Farmer", // Hardcoded fallback
    email: user?.email || "john@farmer.com", // Hardcoded fallback
    phone: user?.phone || "+91 98765 43210", // Hardcoded fallback
    areaVillage: user?.areaVillage || "Green Valley Village", // Hardcoded fallback
    pincode: user?.pincode || "123456", // Hardcoded fallback
    state: user?.state || "Maharashtra", // Hardcoded fallback
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordSection, setPasswordSection] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Replace with actual API call to save profile data
    // Example: await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(formData) })
    console.log("Saving profile data:", formData)
    setIsEditing(false)
    setPasswordSection(false)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || "John Farmer",
      email: user?.email || "john@farmer.com",
      phone: user?.phone || "+91 98765 43210",
      areaVillage: user?.areaVillage || "Green Valley Village",
      pincode: user?.pincode || "123456",
      state: user?.state || "Maharashtra",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsEditing(false)
    setPasswordSection(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-green-200">
                <AvatarImage src="/farmer-avatar.png" />
                <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800">{formData.name}</h2>
              <p className="text-green-600">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <MapPin className="h-3 w-3 mr-1" />
                  {formData.areaVillage}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Phone className="h-3 w-3 mr-1" />
                  {formData.phone}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-green-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="areaVillage" className="text-green-700">
                Area/Village
              </Label>
              <Input
                id="areaVillage"
                name="areaVillage"
                value={formData.areaVillage}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-green-700">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-green-700">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-green-200 focus:border-green-500 disabled:bg-green-50/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Section */}
      <Card className="border-green-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password & Security
            </CardTitle>
            {!passwordSection && (
              <Button
                onClick={() => setPasswordSection(true)}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        {passwordSection && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-green-700">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-green-700">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-700">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="border-green-200 focus:border-green-500"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Update Password
              </Button>
              <Button
                onClick={() => setPasswordSection(false)}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
