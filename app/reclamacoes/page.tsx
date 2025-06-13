"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  Clock,
  BarChart3,
  Building2,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  ChevronRight,
  Home,
  Bell,
  Settings,
  Waves,
  Trophy,
} from "lucide-react"
import { ComplaintProvider } from "@/contexts/complaint-context"
import { ComplaintCard } from "@/components/complaint-card"
import { ComplaintFilters } from "@/components/complaint-filters"
import { CityRanking } from "@/components/admin/city-ranking"
import { useComplaints } from "@/contexts/complaint-context"
import { CreateComplaintBox } from "@/components/create-complaint-box"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"

function ComplaintList() {
  const { filteredComplaints } = useComplaints()
  const [sortOrder, setSortOrder] = useState("recentes")

  // Sort complaints based on selected order
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortOrder === "recentes") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortOrder === "curtidas") {
      return b.likes.length - a.likes.length
    } else if (sortOrder === "comentarios") {
      return b.comments.length - a.comments.length
    }
    return 0
  })

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-blue-800">Reclamações</h2>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full sm:w-48 border-blue-200 focus:border-blue-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais Recentes</SelectItem>
            <SelectItem value="curtidas">Mais Curtidas</SelectItem>
            <SelectItem value="comentarios">Mais Comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* LinkedIn-style create post box */}
      <CreateComplaintBox />

      {sortedComplaints.length > 0 ? (
        <div className="space-y-4">
          {sortedComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      ) : (
        <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma reclamação encontrada com os filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MainContent() {
  const [activeTab, setActiveTab] = useState("reclamacoes")
  const { currentUser } = useComplaints()

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <ComplaintFilters />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 h-11 bg-white/80 backdrop-blur-sm border border-blue-200">
              <TabsTrigger
                value="reclamacoes"
                className="text-xs sm:text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Reclamações
              </TabsTrigger>
              <TabsTrigger
                value="ranking"
                className="text-xs sm:text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Ranking de Cidades
              </TabsTrigger>
              <TabsTrigger
                value="estatisticas"
                className="text-xs sm:text-sm px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Estatísticas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reclamacoes">
              <ComplaintList />
            </TabsContent>

            <TabsContent value="ranking">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 mb-6">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Ranking de Cidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Confira o desempenho das cidades em relação à resolução de reclamações, quantidade total e
                    velocidade de resposta.
                  </p>
                  <CityRanking />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-blue-800">78%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Taxa de Resolução</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-blue-800">2.8</div>
                    <div className="text-xs sm:text-sm text-gray-600">Dias Médios</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-blue-800">12.4k</div>
                    <div className="text-xs sm:text-sm text-gray-600">Usuários Ativos</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bol text-blue-800">156</div>
                    <div className="text-xs sm:text-sm text-gray-600">Cidades</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-blue-800">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Categorias Mais Reclamadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { categoria: "Infraestrutura", total: 3247, porcentagem: 35 },
                      { categoria: "Saúde", total: 2156, porcentagem: 23 },
                      { categoria: "Transporte", total: 1834, porcentagem: 20 },
                      { categoria: "Segurança", total: 1245, porcentagem: 13 },
                      { categoria: "Educação", total: 834, porcentagem: 9 },
                    ].map((item) => (
                      <div key={item.categoria} className="space-y-1">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="font-medium text-blue-800">{item.categoria}</span>
                          <span className="text-gray-600">{item.total}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-blue-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full shadow-sm"
                              style={{ width: `${item.porcentagem}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold w-8 text-right text-blue-800">
                            {item.porcentagem}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ReclamacoesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <ComplaintProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Mobile Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-50">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Waves className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  OpinaAi
                </span>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                <SearchBar />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                    Dashboard
                  </Button>
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-50">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-50">
                  <Bell className="w-4 h-4" />
                </Button>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-50">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-blue-50">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center">
                          <Waves className="w-4 h-4 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                          Opinaai
                        </span>
                      </SheetTitle>
                      <SheetDescription className="text-gray-600">Sua voz importa para a cidade</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <Link href="/dashboard">
                        <Button className="w-full justify-start h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Dashboard Administrativo
                        </Button>
                      </Link>
                      <div className="space-y-2">
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full justify-start h-11 text-blue-700 hover:bg-blue-50">
                            <Home className="w-4 h-4 mr-3" />
                            Dashboard
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start h-11 text-blue-700 hover:bg-blue-50">
                          <MessageSquare className="w-4 h-4 mr-3" />
                          Reclamações
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-11 text-blue-700 hover:bg-blue-50">
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Comparador
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-11 text-blue-700 hover:bg-blue-50">
                          <Settings className="w-4 h-4 mr-3" />
                          Configurações
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden px-4 pb-3">
            <SearchBar mobile={true} />
          </div>
        </header>

        {/* Mobile Quick Stats */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 sm:py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="px-4 sm:px-6 relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">156</div>
                <div className="text-blue-100 text-xs sm:text-sm">Cidades</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">12.4k</div>
                <div className="text-blue-100 text-xs sm:text-sm">Reclamações</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">78%</div>
                <div className="text-blue-100 text-xs sm:text-sm">Resolução</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">2.8</div>
                <div className="text-blue-100 text-xs sm:text-sm">Dias Médios</div>
              </div>
            </div>
          </div>
        </section>

        <MainContent />

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-6 sm:py-8 mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Waves className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold">Opinaai</span>
                </div>
                <p className="text-blue-200 mb-4 text-sm">
                  Conectando cidadãos e prefeituras para construir cidades melhores.
                </p>
                <div className="flex space-x-4">
                  <Facebook className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                  <Twitter className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                  <Instagram className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base text-blue-100">Plataforma</h3>
                <ul className="space-y-2 text-blue-300 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Como Funciona
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Fazer Reclamação
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Rankings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Comparador
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base text-blue-100">Suporte</h3>
                <ul className="space-y-2 text-blue-300 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Central de Ajuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Termos de Uso
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacidade
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contato
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm sm:text-base text-blue-100">Contato</h3>
                <div className="space-y-2 text-blue-300 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>(11) 3000-0000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>contato@opinaai.com.br</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>São Paulo, SP</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-blue-800" />

            <div className="text-center text-blue-300 text-xs sm:text-sm">
              <p>&copy; 2024 Opinaai. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </ComplaintProvider>
  )
}
