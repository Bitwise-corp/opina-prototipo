"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"

export function CityResolutionChart() {
  const { complaints } = useComplaints()

  // Calculate city statistics
  const cityStats: Record<string, { total: number; resolved: number; rate: number }> = {}

  complaints.forEach((complaint) => {
    const { city, status } = complaint

    if (!cityStats[city]) {
      cityStats[city] = {
        total: 0,
        resolved: 0,
        rate: 0,
      }
    }

    cityStats[city].total += 1

    if (status === "Resolvido") {
      cityStats[city].resolved += 1
    }
  })

  // Calculate resolution rates and filter cities with at least 2 complaints
  const citiesWithData = Object.entries(cityStats)
    .map(([city, stats]) => {
      return {
        city,
        total: stats.total,
        resolved: stats.resolved,
        rate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0,
      }
    })
    .filter((city) => city.total >= 2)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Taxa de Resolução por Cidade
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {citiesWithData.map((city) => (
            <div key={city.city} className="space-y-1">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="font-medium text-blue-800">{city.city}</span>
                <span className="text-gray-600">
                  {city.resolved} de {city.total}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full shadow-sm ${
                      city.rate >= 70
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : city.rate >= 40
                          ? "bg-gradient-to-r from-amber-500 to-amber-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                    style={{ width: `${city.rate}%` }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm font-semibold w-8 text-right text-blue-800">{city.rate}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
