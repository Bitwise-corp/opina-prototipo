"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Search,
  ImageIcon,
  Send,
} from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

export function ComplaintManagement() {
  const { complaints, filteredComplaints, filters, setFilters, respondToComplaint, updateComplaintStatus } =
    useComplaints()
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const complaint = complaints.find((c) => c.id === selectedComplaint)

  const displayedComplaints =
    searchTerm || statusFilter !== "all"
      ? complaints.filter((c) => {
          const matchesSearch = searchTerm
            ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase())
            : true

          const matchesStatus = statusFilter !== "all" ? c.status === statusFilter : true

          return matchesSearch && matchesStatus
        })
      : filteredComplaints

  const handleSendResponse = () => {
    if (selectedComplaint && responseText.trim()) {
      respondToComplaint(selectedComplaint, responseText.trim())
      setResponseText("")
    }
  }

  const handleStatusChange = (status: "Aguardando" | "Em Andamento" | "Resolvido") => {
    if (selectedComplaint) {
      updateComplaintStatus(selectedComplaint, status)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolvido":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Em Andamento":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Aguardando":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolvido":
        return <CheckCircle className="w-3 h-3" />
      case "Em Andamento":
        return <AlertCircle className="w-3 h-3" />
      case "Aguardando":
        return <XCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const handleImageError = (imageId: string) => {
    setImageError((prev) => ({ ...prev, [imageId]: true }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar reclamações..."
            className="pl-9 border-blue-200 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 border-blue-200 focus:border-blue-400">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Aguardando">Aguardando</SelectItem>
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayedComplaints.length > 0 ? (
          displayedComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              className="hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200 cursor-pointer"
              onClick={() => setSelectedComplaint(complaint.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base leading-tight text-blue-900 mb-1">
                      {complaint.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {complaint.city}
                      </span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                        {complaint.category}
                      </Badge>
                      <span>•</span>
                      <span className="text-xs text-gray-500">{formatDate(complaint.date)}</span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-1">{complaint.description}</p>
                  </div>
                  <Badge className={`${getStatusColor(complaint.status)} text-xs px-2 py-1 border shrink-0`}>
                    {getStatusIcon(complaint.status)}
                    <span className="ml-1">{complaint.status}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <ThumbsUp className="w-3 h-3" />
                      {complaint.likes.length}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <MessageSquare className="w-3 h-3" />
                      {complaint.comments.length}
                    </span>
                  </div>
                  <div>
                    {complaint.response ? (
                      <span className="text-xs text-emerald-600 font-medium">Respondido</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Aguardando resposta</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma reclamação encontrada com os filtros selecionados.
          </div>
        )}
      </div>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {complaint && (
            <>
              <DialogHeader>
                <DialogTitle className="text-blue-800">{complaint.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* User Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Avatar className="w-6 h-6 border border-blue-200">
                    {complaint.userAvatar ? (
                      <AvatarImage src={complaint.userAvatar || "/placeholder.svg"} alt={complaint.userName} />
                    ) : (
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                        {complaint.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span>{complaint.userName}</span>
                  <span>•</span>
                  <span>{formatDate(complaint.date)}</span>
                </div>

                {/* Status and Category */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getStatusColor(complaint.status)} text-xs px-2 py-1 border`}>
                    {getStatusIcon(complaint.status)}
                    <span className="ml-1">{complaint.status}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {complaint.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                    {complaint.type}
                  </Badge>
                </div>

                {/* Description */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{complaint.description}</p>
                </div>

                {/* Images */}
                {complaint.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {complaint.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-md overflow-hidden border border-gray-200 bg-gray-100"
                      >
                        {imageError[`${complaint.id}-${index}`] ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        ) : (
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Imagem ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(`${complaint.id}-${index}`)}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Location */}
                {complaint.location && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Localização:</span>
                      <span className="text-gray-700">{complaint.location.address}</span>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {complaint.comments.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-800">Comentários ({complaint.comments.length})</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {complaint.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-md p-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5 border border-blue-200">
                                {comment.userAvatar ? (
                                  <AvatarImage src={comment.userAvatar || "/placeholder.svg"} alt={comment.userName} />
                                ) : (
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                    {comment.userName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="text-xs font-medium">{comment.userName}</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                          </div>
                          <p className="text-xs mt-1">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Response */}
                {complaint.response && (
                  <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-400">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-green-800">{complaint.response.adminName}</span>
                      <span className="text-xs text-gray-500">{formatDate(complaint.response.date)}</span>
                    </div>
                    <p className="text-sm mt-1 text-gray-700">{complaint.response.text}</p>
                  </div>
                )}

                {/* Admin Actions */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={complaint.status === "Aguardando" ? "default" : "outline"}
                      className={
                        complaint.status === "Aguardando"
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-red-200 text-red-700 hover:bg-red-50"
                      }
                      onClick={() => handleStatusChange("Aguardando")}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Aguardando
                    </Button>
                    <Button
                      size="sm"
                      variant={complaint.status === "Em Andamento" ? "default" : "outline"}
                      className={
                        complaint.status === "Em Andamento"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "border-amber-200 text-amber-700 hover:bg-amber-50"
                      }
                      onClick={() => handleStatusChange("Em Andamento")}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Em Andamento
                    </Button>
                    <Button
                      size="sm"
                      variant={complaint.status === "Resolvido" ? "default" : "outline"}
                      className={
                        complaint.status === "Resolvido"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }
                      onClick={() => handleStatusChange("Resolvido")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolvido
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-800">Responder</h4>
                    <Textarea
                      placeholder="Escreva uma resposta oficial..."
                      className="min-h-[100px] text-sm border-blue-200 focus:border-blue-400"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSendResponse}
                      disabled={!responseText.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
