"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"

interface SearchBarProps {
  className?: string
  mobile?: boolean
}

export function SearchBar({ className = "", mobile = false }: SearchBarProps) {
  const { setFilters, filters } = useComplaints()
  const [searchTerm, setSearchTerm] = useState(filters.search || "")

  // Update local state when global filters change
  useEffect(() => {
    setSearchTerm(filters.search || "")
  }, [filters.search])

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 ${mobile ? "w-4 h-4" : "w-5 h-5"}`}
      />
      <Input
        placeholder={mobile ? "Buscar reclamações..." : "Busque por cidade, categoria ou palavra-chave..."}
        className={`${
          mobile ? "pl-9 h-10 text-sm" : "pl-10 h-12 text-lg"
        } border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        onClick={handleSearch}
      >
        Buscar
      </Button>
    </div>
  )
}
