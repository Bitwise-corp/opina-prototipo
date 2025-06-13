"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Filter, Search, X } from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"

export function ComplaintFilters() {
  const { complaints, filters, setFilters } = useComplaints()
  const [localFilters, setLocalFilters] = useState(filters)

  // Extract unique values for filter options
  const cities = Array.from(new Set(complaints.map((c) => c.city))).sort()
  const categories = Array.from(new Set(complaints.map((c) => c.category))).sort()
  const types = Array.from(new Set(complaints.map((c) => c.type))).sort()
  const statuses = ["Aguardando", "Em Andamento", "Resolvido"]

  // Apply filters when user clicks apply button
  const applyFilters = () => {
    setFilters(localFilters)
  }

  // Reset all filters
  const resetFilters = () => {
    const emptyFilters = {
      city: "",
      category: "",
      type: "",
      search: "",
      status: "",
    }
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
  }

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Filter className="w-5 h-5 text-blue-600" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar reclamações..."
            className="pl-9 border-blue-200 focus:border-blue-400"
            value={localFilters.search}
            onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Cidade</label>
            <Select
              value={localFilters.city}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, city: value }))}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Categoria</label>
            <Select
              value={localFilters.category}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Tipo</label>
            <Select
              value={localFilters.type}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={resetFilters}
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={applyFilters}
          >
            <Filter className="w-4 h-4 mr-1" />
            Aplicar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
