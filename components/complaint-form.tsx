"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Send } from "lucide-react"
import { useComplaints } from "@/contexts/complaint-context"
import { toast } from "sonner"

interface ComplaintFormProps {
  onSuccess?: () => void
  className?: string
}

export function ComplaintForm({ onSuccess, className }: ComplaintFormProps) {
  const { addComplaint, currentUser } = useComplaints()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    category: "",
    type: "",
    images: [] as string[],
  })

  const cities = [
    "São Paulo",
    "Curitiba",
    "Florianópolis",
    "Porto Alegre",
    "Belo Horizonte",
    "Brasília",
    "Rio de Janeiro",
    "Salvador",
  ]

  const categories = [
    "Infraestrutura",
    "Saúde",
    "Educação",
    "Segurança",
    "Transporte",
    "Meio Ambiente",
    "Serviços Públicos",
    "Outros",
  ]

  const types = {
    Infraestrutura: ["Buraco na Via", "Iluminação Pública", "Calçada Danificada", "Alagamento", "Sinalização"],
    Saúde: ["Atendimento Ruim", "Falta de Medicamentos", "Condições Sanitárias", "Tempo de Espera"],
    Educação: ["Estrutura Escolar", "Falta de Professores", "Material Didático", "Transporte Escolar"],
    Segurança: ["Falta de Policiamento", "Iluminação Precária", "Áreas de Risco", "Câmeras de Segurança"],
    Transporte: ["Transporte Público", "Pontos de Ônibus", "Horários", "Condições dos Veículos"],
    "Meio Ambiente": ["Poluição", "Lixo/Entulho", "Áreas Verdes", "Poda de Árvores"],
    "Serviços Públicos": ["Falta de Água", "Energia Elétrica", "Coleta de Lixo", "Limpeza Urbana"],
    Outros: ["Barulho Excessivo", "Eventos", "Fiscalização", "Outros"],
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Reset type if category changes
    if (field === "category") {
      setFormData((prev) => ({ ...prev, type: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast.error("Você precisa estar logado para enviar uma reclamação")
      return
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.city || !formData.category || !formData.type) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsSubmitting(true)

    try {
      addComplaint({
        ...formData,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        location: {
          lat: -23.5505,
          lng: -46.6333,
          address: `Endereço simulado em ${formData.city}`,
        },
      })

      toast.success("Reclamação enviada com sucesso!")

      // Reset form
      setFormData({
        title: "",
        description: "",
        city: "",
        category: "",
        type: "",
        images: [],
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast.error("Erro ao enviar reclamação. Tente novamente.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
          <SelectTrigger className="border-blue-200 focus:border-blue-400">
            <SelectValue placeholder="Selecione sua cidade" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
          <SelectTrigger className="border-blue-200 focus:border-blue-400">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {formData.category && (
          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
            <SelectTrigger className="border-blue-200 focus:border-blue-400">
              <SelectValue placeholder="Tipo de problema" />
            </SelectTrigger>
            <SelectContent>
              {types[formData.category as keyof typeof types]?.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder="Título da reclamação"
          className="border-blue-200 focus:border-blue-400"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <Textarea
          placeholder="Descreva o problema detalhadamente..."
          rows={4}
          className="border-blue-200 focus:border-blue-400"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <ImageUpload onChange={(images) => handleChange("images", images)} value={formData.images} />

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={() => {
              if (onSuccess) onSuccess()
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            disabled={isSubmitting}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Enviando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
