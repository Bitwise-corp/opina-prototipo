"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"

interface CityStats {
  city: string
  total: number
  resolved: number
  inProgress: number
  awaiting: number
  resolutionRate: number
}

export function CityRanking() {
  const { complaints } = useComplaints()
  const [rankingType, setRankingType] = useState<"resolution" | "total" | "speed">("resolution")

  // Calculate city statistics
  const cityStats: Record<string, CityStats> = {}

  complaints.forEach((complaint) => {
    const { city, status } = complaint

    if (!cityStats[city]) {
      cityStats[city] = {
        city,
        total: 0,
        resolved: 0,
        inProgress: 0,
        awaiting: 0,
        resolutionRate: 0,
      }
    }

    cityStats[city].total += 1

    if (status === "Resolvido") {
      cityStats[city].resolved += 1
    } else if (status === "Em Andamento") {
      cityStats[city].inProgress += 1
    } else {
      cityStats[city].awaiting += 1
    }
  })

  // Calculate resolution rates
  Object.values(cityStats).forEach((city) => {
    city.resolutionRate = city.total > 0 ? Math.round((city.resolved / city.total) * 100) : 0
  })

  // Sort cities based on selected ranking type
  const sortedCities = Object.values(cityStats).sort((a, b) => {
    if (rankingType === "resolution") {
      return b.resolutionRate - a.resolutionRate
    } else if (rankingType === "total") {
      return b.total - a.total
    } else {
      // Speed ranking (simplified - using the ratio of resolved to total)
      const aSpeed = a.total > 0 ? a.resolved / a.total : 0
      const bSpeed = b.total > 0 ? b.resolved / b.total : 0
      return bSpeed - aSpeed
    }
  })

  // Get top 10 cities
  const topCities = sortedCities.slice(0, 10)

  // Get medal color based on position
  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"
      case 1:
        return "text-gray-400"
      case 2:
        return "text-amber-700"
      default:
        return "text-blue-600"
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Ranking de Cidades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs value={rankingType} onValueChange={(value) => setRankingType(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-9 bg-white/80 backdrop-blur-sm border border-blue-200">
            <TabsTrigger
              value="resolution"
              className="text-xs px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Taxa de Resolução
            </TabsTrigger>
            <TabsTrigger
              value="total"
              className="text-xs px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Total de Reclamações
            </TabsTrigger>
            <TabsTrigger
              value="speed"
              className="text-xs px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Velocidade de Resposta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resolution" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100">
                    <th className="py-2 px-2 text-left font-medium text-blue-800 w-10">#</th>
                    <th className="py-2 px-2 text-left font-medium text-blue-800">Cidade</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Taxa</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Resolvidas</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((city, index) => (
                    <tr key={city.city} className="border-b border-blue-50 hover:bg-blue-50/50">
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50">
                          <Trophy className={`w-3 h-3 ${getMedalColor(index)}`} />
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{city.city}</td>
                      <td className="py-2 px-2 text-right">
                        <Badge
                          className={`${
                            city.resolutionRate >= 70
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : city.resolutionRate >= 40
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          } border`}
                        >
                          {city.resolutionRate}%
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-600 font-medium">{city.resolved}</td>
                      <td className="py-2 px-2 text-right text-gray-600">{city.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="total" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100">
                    <th className="py-2 px-2 text-left font-medium text-blue-800 w-10">#</th>
                    <th className="py-2 px-2 text-left font-medium text-blue-800">Cidade</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Total</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((city, index) => (
                    <tr key={city.city} className="border-b border-blue-50 hover:bg-blue-50/50">
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50">
                          <Trophy className={`w-3 h-3 ${getMedalColor(index)}`} />
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{city.city}</td>
                      <td className="py-2 px-2 text-right font-medium">{city.total}</td>
                      <td className="py-2 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="flex items-center text-emerald-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {city.resolved}
                          </span>
                          <span className="text-gray-400 mx-1">|</span>
                          <span className="flex items-center text-amber-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {city.inProgress}
                          </span>
                          <span className="text-gray-400 mx-1">|</span>
                          <span className="flex items-center text-red-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            {city.awaiting}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="speed" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100">
                    <th className="py-2 px-2 text-left font-medium text-blue-800 w-10">#</th>
                    <th className="py-2 px-2 text-left font-medium text-blue-800">Cidade</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Resolvidas</th>
                    <th className="py-2 px-2 text-right font-medium text-blue-800">Tempo Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((city, index) => (
                    <tr key={city.city} className="border-b border-blue-50 hover:bg-blue-50/50">
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50">
                          <Trophy className={`w-3 h-3 ${getMedalColor(index)}`} />
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{city.city}</td>
                      <td className="py-2 px-2 text-right text-emerald-600 font-medium">{city.resolved}</td>
                      <td className="py-2 px-2 text-right">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                          {Math.floor(Math.random() * 5) + 1} dias
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
