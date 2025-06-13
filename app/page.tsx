"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ComplaintProvider } from "@/contexts/complaint-context"
import { Info, ThumbsUp, MessageSquare, AlertTriangle, FileText, Megaphone, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Definição das informações para cada tipo de card
const cardInfo = {
  informacao: {
    title: "Pedido de acesso à informação",
    description:
      "Solicite dados, documentos e informações produzidas ou custodiadas por órgãos e entidades públicas que não estejam disponíveis para acesso público.",
    details: [
      "Você tem direito a solicitar qualquer informação pública não classificada como sigilosa.",
      "O órgão tem até 20 dias para responder ao seu pedido, prorrogáveis por mais 10 dias.",
      "Caso a informação solicitada não seja fornecida, você pode apresentar recurso.",
    ],
  },
  elogio: {
    title: "Elogio",
    description:
      "Demonstre sua satisfação com um serviço público prestado ou com o atendimento recebido de um servidor público.",
    details: [
      "Seu elogio será encaminhado diretamente ao órgão ou servidor mencionado.",
      "Contribui para reconhecer boas práticas e incentivar a qualidade no serviço público.",
      "Ajuda a identificar servidores e setores que merecem destaque por sua atuação.",
    ],
  },
  sugestao: {
    title: "Sugestão",
    description:
      "Proponha ideias ou apresente propostas de aprimoramento de políticas e serviços prestados pela administração pública.",
    details: [
      "Suas sugestões podem ajudar a melhorar os serviços públicos.",
      "Ideias inovadoras podem ser implementadas e beneficiar toda a comunidade.",
      "Contribua com sua visão para tornar a gestão pública mais eficiente.",
    ],
  },
  solicitacao: {
    title: "Solicitação de providência",
    description:
      "Peça a adoção de providências por parte da administração pública para solucionar problemas na prestação de serviços públicos.",
    details: [
      "Utilize para solicitar serviços como tapa-buracos, poda de árvores, reparo de iluminação pública, etc.",
      "Sua solicitação será encaminhada ao órgão responsável pelo serviço.",
      "Você receberá um número de protocolo para acompanhar o andamento da sua solicitação.",
    ],
  },
  reclamacao: {
    title: "Reclamação",
    description:
      "Manifeste sua insatisfação com um serviço público prestado ou com a conduta de agentes públicos na prestação desses serviços.",
    details: [
      "Sua reclamação será analisada e encaminhada ao órgão responsável.",
      "O órgão tem prazo definido para responder e tomar providências.",
      "Você pode acompanhar o status da sua reclamação através do número de protocolo.",
    ],
  },
  denuncia: {
    title: "Denúncia",
    description:
      "Comunique a ocorrência de ato ilícito ou irregularidade praticada contra a administração pública ou em exercício de função pública.",
    details: [
      "Sua denúncia pode ser feita de forma anônima, se preferir.",
      "Todas as denúncias são investigadas pelos órgãos competentes.",
      "Contribua para combater a corrupção e melhorar a gestão pública.",
    ],
  },
}

export default function HomePage() {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setIsInfoDialogOpen(true)
  }

  const selectedCardInfo = selectedOption ? cardInfo[selectedOption as keyof typeof cardInfo] : null

  return (
    <ComplaintProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">OpinaAi</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/reclamacoes">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  Ver Reclamações
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                O seu canal de comunicação com o Governo
              </h1>
              <p className="text-lg text-gray-600">
                Aqui você pode fazer um pedido de acesso à informação, denúncias, elogios, reclamações, solicitações ou
                enviar sugestões.
              </p>
              {/* Botões removidos conforme solicitado */}
            </div>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-I8QLFGZ1PqOlNlAg5J1qR6GN91wDSK.png"
                alt="OpinaAi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              <h2 className="text-2xl font-bold text-gray-800">O QUE VOCÊ QUER FAZER?</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("informacao")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-sm">Pedido de acesso à informação</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("elogio")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-medium text-sm">Elogio</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("sugestao")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-sm">Sugestão</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("solicitacao")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="font-medium text-sm">Solicitação de providência</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("reclamacao")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="font-medium text-sm">Reclamação</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300"
                onClick={() => handleOptionClick("denuncia")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="font-medium text-sm">Denúncia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">12.4k</div>
                <div className="text-sm text-gray-600 mt-1">Reclamações</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">78%</div>
                <div className="text-sm text-gray-600 mt-1">Taxa de Resolução</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600 mt-1">Cidades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">2.8</div>
                <div className="text-sm text-gray-600 mt-1">Dias Médios</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">O</span>
                  </div>
                  <span className="text-lg font-bold">OpinaAi</span>
                </div>
                <p className="text-gray-400 text-sm">Conectando cidadãos e governo para construir um país melhor.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Como Funciona
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Perguntas Frequentes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Termos de Uso
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Política de Privacidade
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Contato</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>Telefone: (61) 3000-0000</li>
                  <li>Email: contato@opinaai.com.br</li>
                  <li>Horário: Segunda a Sexta, 8h às 18h</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
              <p>&copy; 2024 OpinaAi. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Diálogo de informações */}
        <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
          <DialogContent className="sm:max-w-xl mx-4 bg-gradient-to-b from-white to-blue-50">
            {selectedCardInfo && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-blue-800">{selectedCardInfo.title}</DialogTitle>
                  <DialogDescription className="text-gray-600 mt-2">{selectedCardInfo.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <h4 className="font-medium text-blue-700">Como funciona:</h4>
                  <ul className="space-y-2">
                    {selectedCardInfo.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Link href="/reclamacoes">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        Acessar {selectedCardInfo.title}
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ComplaintProvider>
  )
}
