"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  BarChart3,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"
import { ComplaintManagement } from "@/components/admin/management"
import { CityRanking } from "@/components/admin/city-ranking"
import { CityResolutionChart } from "@/components/admin/city-resolution-chart"
import { useState } from "react"

export function AdminDashboard() {
  const { complaints } = useComplaints()
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const totalComplaints = complaints.length
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolvido").length
  const inProgressComplaints = complaints.filter((c) => c.status === "Em Andamento").length
  const pendingComplaints = complaints.filter((c) => c.status === "Aguardando").length

  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0

  const totalLikes = complaints.reduce((sum, complaint) => sum + complaint.likes.length, 0)
  const totalComments = complaints.reduce((sum, complaint) => sum + complaint.comments.length, 0)

  // Calculate average response time (in days)
  const responseTimes = complaints
    .filter((c) => c.response)
    .map((c) => {
      const createdDate = new Date(c.date)
      const responseDate = new Date(c.response!.date)
      return (responseDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24) // Convert to days
    })

  const averageResponseTime =
    responseTimes.length > 0
      ? Math.round((responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) * 10) / 10
      : 0

  // Get top categories
  const categoryCounts: Record<string, number> = {}
  complaints.forEach((complaint) => {
    const category = complaint.category
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalComplaints) * 100),
    }))

  // Get top cities
  const cityCounts: Record<string, number> = {}
  complaints.forEach((complaint) => {
    const city = complaint.city
    cityCounts[city] = (cityCounts[city] || 0) + 1
  })

  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, count]) => ({
      city,
      count,
      percentage: Math.round((count / totalComplaints) * 100),
    }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Painel Administrativo</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 h-11 bg-white/80 backdrop-blur-sm border border-blue-200">
          <TabsTrigger
            value="overview"
            className="text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="rankings"
            className="text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Rankings
          </TabsTrigger>
          <TabsTrigger
            value="management"
            className="text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Gerenciar Reclamações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-blue-800">{totalComplaints}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total de Reclamações</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-blue-800">{resolutionRate}%</div>
                <div className="text-xs sm:text-sm text-gray-600">Taxa de Resolução</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-blue-800">{averageResponseTime}</div>
                <div className="text-xs sm:text-sm text-gray-600">Dias Médios</div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-blue-800">{totalLikes}</div>
                <div className="text-xs sm:text-sm text-gray-600">Interações</div>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                <BarChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Status das Reclamações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-100">
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-red-800">{pendingComplaints}</div>
                  <div className="text-xs text-red-600">Aguardando</div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-100">
                  <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-amber-800">{inProgressComplaints}</div>
                  <div className="text-xs text-amber-600">Em Andamento</div>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 text-center border border-emerald-100">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-emerald-800">{resolvedComplaints}</div>
                  <div className="text-xs text-emerald-600">Resolvido</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Categories and Cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Categorias Mais Reclamadas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 sm:space-y-4">
                  {topCategories.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-medium text-blue-800">{item.category}</span>
                        <span className="text-gray-600">{item.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full shadow-sm"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold w-8 text-right text-blue-800">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Cidades Mais Ativas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 sm:space-y-4">
                  {topCities.map((item) => (
                    <div key={item.city} className="space-y-1">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-medium text-blue-800">{item.city}</span>
                        <span className="text-gray-600">{item.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-blue-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full shadow-sm"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold w-8 text-right text-blue-800">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Stats */}
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Engajamento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <ThumbsUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-800">{totalLikes}</div>
                  <div className="text-xs text-blue-600">Curtidas</div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 text-center border border-indigo-100">
                  <MessageSquare className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-indigo-800">{totalComments}</div>
                  <div className="text-xs text-indigo-600">Comentários</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          {/* City Rankings */}
          <CityRanking />

          {/* City Resolution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CityResolutionChart />

            {/* Category Resolution Chart */}
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Categorias com Maior Taxa de Resolução
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topCategories.map((item) => {
                    const resolvedCount = complaints.filter(
                      (c) => c.category === item.category && c.status === "Resolvido",
                    ).length
                    const resolutionRate = Math.round((resolvedCount / item.count) * 100)

                    return (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-blue-800">{item.category}</span>
                          <span className="text-gray-600">
                            {resolvedCount} de {item.count}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-blue-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full shadow-sm ${
                                resolutionRate >= 70
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                  : resolutionRate >= 40
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600"
                                    : "bg-gradient-to-r from-red-500 to-red-600"
                              }`}
                              style={{ width: `${resolutionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold w-8 text-right text-blue-800">
                            {resolutionRate}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <ComplaintManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
