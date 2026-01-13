"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-4 border-black px-4 py-2 pr-10 font-mono focus:outline-none focus:ring-4 focus:ring-yellow-400 bg-white"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:opacity-80"
      >
        <Search className="h-5 w-5 text-black" />
      </button>
    </form>
  )
}
