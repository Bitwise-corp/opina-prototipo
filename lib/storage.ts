// Types for our data model
export interface Complaint {
  id: string
  title: string
  description: string
  city: string
  category: string
  type: string
  status: "Aguardando" | "Em Andamento" | "Resolvido"
  images: string[]
  userId: string
  userName: string
  userAvatar?: string
  date: string
  likes: string[] // Array of user IDs who liked
  comments: Comment[]
  location?: {
    lat: number
    lng: number
    address?: string
  }
  response?: {
    text: string
    date: string
    adminName: string
  }
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isAdmin: boolean
}

// Mock data generator
export function generateMockData() {
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

  const userNames = [
    "Maria Silva",
    "João Santos",
    "Ana Costa",
    "Pedro Oliveira",
    "Carla Souza",
    "Roberto Almeida",
    "Fernanda Lima",
    "Lucas Martins",
    "Juliana Pereira",
    "Marcos Rodrigues",
    "Camila Ferreira",
    "Bruno Gomes",
  ]

  const complaints: Complaint[] = []

  // Generate 25 mock complaints (more than the required 20)
  for (let i = 1; i <= 25; i++) {
    const cityIndex = Math.floor(Math.random() * cities.length)
    const categoryIndex = Math.floor(Math.random() * categories.length)
    const category = categories[categoryIndex]
    const typeOptions = types[category as keyof typeof types]
    const typeIndex = Math.floor(Math.random() * typeOptions.length)
    const userIndex = Math.floor(Math.random() * userNames.length)

    // Generate random date within the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    // Generate random status
    const statusOptions = ["Aguardando", "Em Andamento", "Resolvido"] as const
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

    // Generate random number of images (0-3)
    const imageCount = Math.floor(Math.random() * 4)
    const images = Array.from(
      { length: imageCount },
      (_, index) => `/placeholder.svg?height=400&width=600&text=Imagem+${i}-${index + 1}`,
    )

    // Generate random number of comments (0-5)
    const commentCount = Math.floor(Math.random() * 6)
    const comments: Comment[] = []

    for (let j = 0; j < commentCount; j++) {
      const commentUserIndex = Math.floor(Math.random() * userNames.length)
      const commentDate = new Date(date)
      commentDate.setHours(commentDate.getHours() + Math.floor(Math.random() * 24))

      comments.push({
        id: `comment-${i}-${j}`,
        userId: `user-${commentUserIndex}`,
        userName: userNames[commentUserIndex],
        text: `Este é um comentário sobre a reclamação #${i}. ${Math.random() > 0.5 ? "Concordo com o problema relatado." : "Também estou enfrentando este problema na região."}`,
        date: commentDate.toISOString(),
      })
    }

    // Generate random number of likes (0-50)
    const likeCount = Math.floor(Math.random() * 51)
    const likes = Array.from({ length: likeCount }, (_, index) => `user-like-${index}`)

    // Add response for some resolved complaints
    let response
    if (status === "Resolvido" || (status === "Em Andamento" && Math.random() > 0.5)) {
      const responseDate = new Date(date)
      responseDate.setHours(responseDate.getHours() + Math.floor(Math.random() * 72))

      response = {
        text: `Agradecemos pelo relato. ${status === "Resolvido" ? "O problema foi solucionado." : "Estamos trabalhando para resolver este problema o mais rápido possível."}`,
        date: responseDate.toISOString(),
        adminName: "Administrador Municipal",
      }
    }

    const type = typeOptions[typeIndex]

    complaints.push({
      id: `complaint-${i}`,
      title: `${type} em ${cities[cityIndex]} - ${i}`,
      description: `Esta é uma reclamação sobre ${type.toLowerCase()} na cidade de ${cities[cityIndex]}. O problema está causando transtornos para os moradores da região há várias semanas.`,
      city: cities[cityIndex],
      category,
      type,
      status,
      images,
      userId: `user-${userIndex}`,
      userName: userNames[userIndex],
      date: date.toISOString(),
      likes,
      comments,
      location: {
        lat: -23.5505 + (Math.random() - 0.5) * 10,
        lng: -46.6333 + (Math.random() - 0.5) * 10,
        address: `Rua Exemplo, ${Math.floor(Math.random() * 1000)}, ${cities[cityIndex]}`,
      },
      response,
    })
  }

  // Create mock users including admins
  const users: User[] = [
    {
      id: "user-admin-1",
      name: "Admin Principal",
      email: "admin@opinaai.com",
      isAdmin: true,
    },
    {
      id: "user-1",
      name: "Usuário Teste",
      email: "usuario@teste.com",
      isAdmin: false,
    },
  ]

  // Add all the mock users
  userNames.forEach((name, index) => {
    users.push({
      id: `user-${index}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      isAdmin: false,
    })
  })

  // Store in localStorage
  localStorage.setItem("opinaai-complaints", JSON.stringify(complaints))
  localStorage.setItem("opinaai-users", JSON.stringify(users))

  // Set current user for testing
  localStorage.setItem("opinaai-current-user", JSON.stringify(users[1]))

  return { complaints, users }
}

// Storage functions
export function getComplaints(): Complaint[] {
  const stored = localStorage.getItem("opinaai-complaints")
  if (!stored) {
    const { complaints } = generateMockData()
    return complaints
  }
  return JSON.parse(stored)
}

export function getComplaint(id: string): Complaint | undefined {
  const complaints = getComplaints()
  return complaints.find((complaint) => complaint.id === id)
}

export function saveComplaint(complaint: Complaint): void {
  const complaints = getComplaints()
  const index = complaints.findIndex((c) => c.id === complaint.id)

  if (index >= 0) {
    complaints[index] = complaint
  } else {
    complaints.push(complaint)
  }

  localStorage.setItem("opinaai-complaints", JSON.stringify(complaints))
}

export function deleteComplaint(complaintId: string): void {
  const complaints = getComplaints()
  const updatedComplaints = complaints.filter((complaint) => complaint.id !== complaintId)
  localStorage.setItem("opinaai-complaints", JSON.stringify(updatedComplaints))
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem("opinaai-current-user")
  if (!stored) return null
  return JSON.parse(stored)
}

export function likeComplaint(complaintId: string, userId: string): void {
  const complaint = getComplaint(complaintId)
  if (!complaint) return

  const hasLiked = complaint.likes.includes(userId)

  if (hasLiked) {
    complaint.likes = complaint.likes.filter((id) => id !== userId)
  } else {
    complaint.likes.push(userId)
  }

  saveComplaint(complaint)
}

export function addComment(complaintId: string, comment: Comment): void {
  const complaint = getComplaint(complaintId)
  if (!complaint) return

  complaint.comments.push(comment)
  saveComplaint(complaint)
}

export function respondToComplaint(complaintId: string, response: { text: string; adminName: string }): void {
  const complaint = getComplaint(complaintId)
  if (!complaint) return

  complaint.response = {
    ...response,
    date: new Date().toISOString(),
  }

  // Update status if it was awaiting response
  if (complaint.status === "Aguardando") {
    complaint.status = "Em Andamento"
  }

  saveComplaint(complaint)
}

export function updateComplaintStatus(complaintId: string, status: "Aguardando" | "Em Andamento" | "Resolvido"): void {
  const complaint = getComplaint(complaintId)
  if (!complaint) return

  complaint.status = status
  saveComplaint(complaint)
}

// Initialize data if not already present
export function initializeData(): void {
  const complaints = localStorage.getItem("opinaai-complaints")
  if (!complaints) {
    generateMockData()
  }
}
