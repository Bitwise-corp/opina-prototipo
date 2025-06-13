"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type Complaint,
  type Comment,
  type User,
  getComplaints,
  getCurrentUser,
  saveComplaint,
  likeComplaint as likeComplaintStorage,
  addComment as addCommentStorage,
  respondToComplaint as respondToComplaintStorage,
  updateComplaintStatus as updateComplaintStatusStorage,
  deleteComplaint as deleteComplaintStorage,
  initializeData,
} from "@/lib/storage"

interface ComplaintContextType {
  complaints: Complaint[]
  filteredComplaints: Complaint[]
  currentUser: User | null
  filters: {
    city: string
    category: string
    type: string
    search: string
    status: string
  }
  setFilters: (filters: any) => void
  addComplaint: (complaint: Omit<Complaint, "id" | "date" | "likes" | "comments">) => void
  likeComplaint: (complaintId: string) => void
  addComment: (complaintId: string, text: string) => void
  respondToComplaint: (complaintId: string, text: string) => void
  updateComplaintStatus: (complaintId: string, status: "Aguardando" | "Em Andamento" | "Resolvido") => void
  deleteComplaint: (complaintId: string) => void
  refreshComplaints: () => void
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined)

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    type: "",
    search: "",
    status: "",
  })

  // Initialize data on first load
  useEffect(() => {
    initializeData()
    refreshComplaints()
    setCurrentUser(getCurrentUser())
  }, [])

  // Apply filters whenever complaints or filters change
  useEffect(() => {
    let result = [...complaints]

    if (filters.city && filters.city !== "all") {
      result = result.filter((c) => c.city === filters.city)
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter((c) => c.category === filters.category)
    }

    if (filters.type && filters.type !== "all") {
      result = result.filter((c) => c.type === filters.type)
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.city.toLowerCase().includes(searchLower) ||
          c.category.toLowerCase().includes(searchLower) ||
          c.type.toLowerCase().includes(searchLower),
      )
    }

    setFilteredComplaints(result)
  }, [complaints, filters])

  const refreshComplaints = () => {
    setComplaints(getComplaints())
  }

  const addComplaint = (complaintData: Omit<Complaint, "id" | "date" | "likes" | "comments">) => {
    if (!currentUser) return

    const newComplaint: Complaint = {
      ...complaintData,
      id: `complaint-${Date.now()}`,
      date: new Date().toISOString(),
      likes: [],
      comments: [],
      status: "Aguardando",
    }

    saveComplaint(newComplaint)
    refreshComplaints()
  }

  const likeComplaint = (complaintId: string) => {
    if (!currentUser) return

    likeComplaintStorage(complaintId, currentUser.id)
    refreshComplaints()
  }

  const addComment = (complaintId: string, text: string) => {
    if (!currentUser) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      date: new Date().toISOString(),
    }

    addCommentStorage(complaintId, newComment)
    refreshComplaints()
  }

  const respondToComplaint = (complaintId: string, text: string) => {
    if (!currentUser || !currentUser.isAdmin) return

    respondToComplaintStorage(complaintId, {
      text,
      adminName: currentUser.name,
    })

    refreshComplaints()
  }

  const updateComplaintStatus = (complaintId: string, status: "Aguardando" | "Em Andamento" | "Resolvido") => {
    if (!currentUser || !currentUser.isAdmin) return

    updateComplaintStatusStorage(complaintId, status)
    refreshComplaints()
  }

  const deleteComplaint = (complaintId: string) => {
    if (!currentUser) return

    deleteComplaintStorage(complaintId)
    refreshComplaints()
  }

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        filteredComplaints,
        currentUser,
        filters,
        setFilters,
        addComplaint,
        likeComplaint,
        addComment,
        respondToComplaint,
        updateComplaintStatus,
        deleteComplaint,
        refreshComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  )
}

export function useComplaints() {
  const context = useContext(ComplaintContext)
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider")
  }
  return context
}
