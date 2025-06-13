"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, MapPin, Send } from "lucide-react"
import { ComplaintForm } from "@/components/complaint-form"
import { useComplaints } from "@/contexts/complaint-context"

export function CreateComplaintBox() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentUser } = useComplaints()

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-blue-200">
              {currentUser?.avatar ? (
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {currentUser?.name
                    ? currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              variant="outline"
              className="flex-1 justify-start h-11 text-gray-500 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setIsModalOpen(true)}
            >
              O que está acontecendo na sua cidade?
            </Button>
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t border-blue-100">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-blue-700 hover:bg-blue-50"
              onClick={() => setIsModalOpen(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Foto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-blue-700 hover:bg-blue-50"
              onClick={() => setIsModalOpen(true)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Local
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-blue-700 hover:bg-blue-50"
              onClick={() => setIsModalOpen(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl mx-4 bg-gradient-to-b from-white to-blue-50">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Nova Reclamação</DialogTitle>
          </DialogHeader>
          <ComplaintForm onSuccess={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
