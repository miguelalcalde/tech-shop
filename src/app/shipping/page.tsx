"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getUserCountry } from "../../utils/geolocation"

export default function ShippingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  })

  useEffect(() => {
    const country = getUserCountry()
    setFormData((prev) => ({ ...prev, country }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shipping details:", formData)
    // Here you would typically send this data to your backend or move to the next step
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">Shipping Information</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm text-muted-foreground mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="addressLine1" className="block text-sm text-muted-foreground mb-1.5">
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="addressLine2" className="block text-sm text-muted-foreground mb-1.5">
            Address Line 2
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm text-muted-foreground mb-1.5">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="region" className="block text-sm text-muted-foreground mb-1.5">
            State/Province/Region
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm text-muted-foreground mb-1.5">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm text-muted-foreground mb-1.5">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          >
            <option value="">Select a country</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Portugal">Portugal</option>
            <option value="Greece">Greece</option>
          </select>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  )
}

