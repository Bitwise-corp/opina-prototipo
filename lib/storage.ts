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
  likes: string[]
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

  const complaintImageMapping = {
    "Buraco na Via": {
      category: "Infraestrutura",
      image: "/buraco.png"
    },
    "Iluminação Pública": {
      category: "Infraestrutura",
      image: "/poste_danificado.png"
    },
    "Calçada Danificada": {
      category: "Infraestrutura",
      image: "/calcada_danificada.png"
    },
    "Atendimento Ruim": {
      category: "Saúde",
      image: "/saude.png"
    },
    "Transporte Público": {
      category: "Transporte",
      image: "/transporte_lotado.png"
    },
    "Lixo/Entulho": {
      category: "Meio Ambiente",
      image: "/entulho.png"
    },
    
  }

  const complaints: Complaint[] = []
  const availableComplaintTypes = Object.keys(complaintImageMapping);

  availableComplaintTypes.forEach((complaintType, index) => {
    const cityIndex = Math.floor(Math.random() * cities.length)
    const userIndex = Math.floor(Math.random() * userNames.length)
    const complaintDetails = complaintImageMapping[complaintType as keyof typeof complaintImageMapping];
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const statusOptions = ["Aguardando", "Em Andamento", "Resolvido"] as const
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

    const images = [complaintDetails.image];

    const commentCount = Math.floor(Math.random() * 6)
    const comments: Comment[] = []

    for (let j = 0; j < commentCount; j++) {
      const commentUserIndex = Math.floor(Math.random() * userNames.length)
      const commentDate = new Date(date)
      commentDate.setHours(commentDate.getHours() + Math.floor(Math.random() * 24))

      comments.push({
        id: `comment-${index}-${j}`,
        userId: `user-${commentUserIndex}`,
        userName: userNames[commentUserIndex],
        text: `Este é um comentário sobre a reclamação.`,
        date: commentDate.toISOString(),
      })
    }

    const likeCount = Math.floor(Math.random() * 51)
    const likes = Array.from({ length: likeCount }, (_, index) => `user-like-${index}`)

    let response
    if (status === "Resolvido" || (status === "Em Andamento" && Math.random() > 0.5)) {
      const responseDate = new Date(date)
      responseDate.setHours(responseDate.getHours() + Math.floor(Math.random() * 72))

      response = {
        text: `Agradecemos pelo relato. O problema foi solucionado.`,
        date: responseDate.toISOString(),
        adminName: "Administrador Municipal",
      }
    }

    complaints.push({
      id: `complaint-${index}`,
      title: `${complaintType} em ${cities[cityIndex]}`,
      description: `Esta é uma reclamação sobre ${complaintType.toLowerCase()} na cidade de ${cities[cityIndex]}. O problema está causando transtornos para os moradores da região.`,
      city: cities[cityIndex],
      category: complaintDetails.category,
      type: complaintType,
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
  });

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

  userNames.forEach((name, index) => {
    users.push({
      id: `user-${index}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      isAdmin: false,
    })
  })

  localStorage.setItem("opinaai-complaints", JSON.stringify(complaints))
  localStorage.setItem("opinaai-users", JSON.stringify(users))
  localStorage.setItem("opinaai-current-user", JSON.stringify(users[1]))

  return { complaints, users }
}

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

export function initializeData(): void {
  generateMockData();
}