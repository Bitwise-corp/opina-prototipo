"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Send,
  ImageIcon,
  MoreVertical,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Complaint } from "@/lib/storage"
import { useComplaints } from "@/contexts/complaint-context"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { toast } from "sonner"

interface ComplaintCardProps {
  complaint: Complaint
  expanded?: boolean
}

export function ComplaintCard({ complaint, expanded = false }: ComplaintCardProps) {
  const { currentUser, likeComplaint, addComment, deleteComplaint } = useComplaints()
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [commentText, setCommentText] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const hasLiked = currentUser ? complaint.likes.includes(currentUser.id) : false
  const isOwner = currentUser && currentUser.id === complaint.userId

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

  const handleLike = () => {
    if (currentUser) {
      likeComplaint(complaint.id)
    }
  }

  const handleComment = () => {
    if (currentUser && commentText.trim()) {
      addComment(complaint.id, commentText.trim())
      setCommentText("")
    }
  }

  const handleDelete = () => {
    if (isOwner) {
      deleteComplaint(complaint.id)
      toast.success("Reclamação excluída com sucesso!")
    }
  }

  const nextImage = () => {
    if (currentImageIndex < complaint.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
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

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border-blue-100 hover:border-blue-200">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg leading-tight flex-1 text-blue-900">
              {complaint.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <Badge className={`${getStatusColor(complaint.status)} text-xs px-2 py-1 border`}>
                {getStatusIcon(complaint.status)}
                <span className="ml-1">{complaint.status}</span>
              </Badge>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir reclamação
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Avatar className="w-4 h-4 sm:w-5 sm:h-5 border border-blue-200">
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
              <span className="truncate">{complaint.userName}</span>
            </div>
            <span>•</span>
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

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{complaint.description}</p>

          {/* Images */}
          {complaint.images.length > 0 && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
              {imageError[currentImageIndex] ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">Imagem não disponível</p>
                </div>
              ) : (
                <Image
                  src={complaint.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`Imagem da reclamação ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  onError={() => handleImageError(currentImageIndex)}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 60vw"
                />
              )}

              {complaint.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === complaint.images.length - 1}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-2 py-1 text-xs text-white">
                    {currentImageIndex + 1} / {complaint.images.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Response */}
          {complaint.response && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-2 sm:p-3 rounded">
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-sm text-blue-800 font-medium">{complaint.response.adminName}</p>
                <span className="text-xs text-gray-500">{formatDate(complaint.response.date)}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mt-1">{complaint.response.text}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-blue-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className={`flex items-center gap-1 ${hasLiked ? "text-blue-600" : "text-gray-500"} hover:text-blue-800 touch-manipulation`}
                onClick={handleLike}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-blue-600" : ""}`} />
                <span className="text-xs sm:text-sm">{complaint.likes.length}</span>
              </button>
              <button
                className="flex items-center gap-1 text-gray-500 hover:text-blue-800 touch-manipulation"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs sm:text-sm">{complaint.comments.length}</span>
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ocultar Detalhes" : "Ver Detalhes"}
            </Button>
          </div>

          {/* Comments Section */}
          {isExpanded && (
            <div className="pt-3 space-y-4">
              <Separator className="bg-blue-100" />

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-blue-800">Comentários ({complaint.comments.length})</h4>

                {complaint.comments.length > 0 ? (
                  <div className="space-y-3">
                    {complaint.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
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
                            <span className="text-xs font-medium text-gray-700">{comment.userName}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 mt-2">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-2">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}

                {currentUser && (
                  <div className="flex gap-2 items-start">
                    <Avatar className="w-6 h-6 mt-1">
                      {currentUser.avatar ? (
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Escreva um comentário..."
                        className="min-h-[60px] text-sm border-blue-200 focus:border-blue-400"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleComment}
                        disabled={!commentText.trim()}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
