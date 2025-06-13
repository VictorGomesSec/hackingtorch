"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Flame,
  User,
  Settings,
  Bell,
  LogOut,
  Search,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  Globe,
  DollarSign,
  Users,
  CalendarRange,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { createBrowserSupabaseClient } from "@/utils/supabase/client"
import { createEvent } from "@/lib/services/event-service"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const supabase = createBrowserSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    event_type: "",
    format: "",
    categories: [] as string[],
    start_date: "",
    end_date: "",
    location: "",
    max_participants: 0,
    max_team_size: 0,
    registration_fee: 0,
    cover_image_url: "",
    status: "draft" as const,
    is_featured: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
        ...(name === "name" ? { title: value } : {}),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "name" ? { title: value } : {}),
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSubmit = async (status: "draft" | "published") => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um evento",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const eventData = {
        ...formData,
        status,
        organizer_id: user.id,
        title: formData.title || formData.name,
        is_featured: formData.is_featured,
      }

      const { event, error } = await createEvent(supabase, eventData)

      if (error) {
        throw error
      }

      toast({
        title: "Sucesso",
        description: `Evento ${status === "draft" ? "salvo como rascunho" : "publicado"} com sucesso!`,
      })

      router.push("/dashboard/organizer")
    } catch (error) {
      console.error("Erro ao criar evento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-black/80 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              HackingTorch
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar eventos..."
                className="w-64 bg-zinc-900/80 border-zinc-800 pl-9 h-9 rounded-full text-sm"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 border border-zinc-700 hover:border-orange-500 transition-colors cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500">JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-white">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <Link href="/settings" className="w-full">
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <Link href="/" className="w-full">
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard/organizer"
          className="inline-flex items-center text-zinc-400 hover:text-white mb-4 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para dashboard do organizador
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Criar Novo Evento</h1>
            <p className="text-zinc-400">Preencha os detalhes para criar seu evento tech</p>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-zinc-900/50">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="schedule">Programação</TabsTrigger>
            <TabsTrigger value="prizes">Prêmios</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Nome do Evento</Label>
                  <Input
                    id="event-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Hackathon Future Tech 2025"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Descrição</Label>
                  <Textarea
                    id="event-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva seu evento..."
                    className="min-h-32 bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Tipo de Evento</Label>
                    <Select value={formData.event_type} onValueChange={(value) => handleSelectChange("event_type", value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="ideathon">Ideathon</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="conference">Conferência</SelectItem>
                        <SelectItem value="meetup">Meetup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-format">Formato</Label>
                    <Select value={formData.format} onValueChange={(value) => handleSelectChange("format", value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="presential">Presencial</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <div className="flex flex-wrap gap-2">
                    {["IA", "Web3", "IoT", "Mobile", "Cloud", "DevOps", "Data Science", "Blockchain"].map(
                      (category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className={`border-zinc-700 text-zinc-400 cursor-pointer hover:border-orange-500/50 hover:text-orange-400 ${
                            formData.categories.includes(category) ? "border-orange-500/50 text-orange-400" : ""
                          }`}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          {category}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imagem de Capa</Label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-orange-500/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-zinc-500 mb-3" />
                      <p className="text-zinc-300 mb-2">Arraste e solte uma imagem aqui ou clique para fazer upload</p>
                      <p className="text-zinc-500 text-sm mb-4">PNG, JPG ou GIF (máx. 5MB)</p>
                      <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400">
                        Selecionar arquivo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="is-featured" name="is_featured" checked={formData.is_featured} onCheckedChange={v => setFormData(prev => ({...prev, is_featured: v}))} />
                  <Label htmlFor="is-featured">Destacar evento na página inicial</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-zinc-800 p-4">
                <Button 
                  variant="outline" 
                  className="border-zinc-700"
                  onClick={() => handleSubmit("draft")}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar rascunho"}
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400"
                  onClick={() => handleSubmit("published")}
                  disabled={loading}
                >
                  {loading ? "Publicando..." : "Publicar evento"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data de Início</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input 
                        id="start-date" 
                        name="start_date"
                        type="date" 
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700 pl-10" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data de Término</Label>
                    <div className="relative">
                      <CalendarRange className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input 
                        id="end-date" 
                        name="end_date"
                        type="date" 
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700 pl-10" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                    <Input 
                      id="location" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Endereço ou link do evento" 
                      className="bg-zinc-800 border-zinc-700 pl-10" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-participants">Máximo de Participantes</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input 
                        id="max-participants" 
                        name="max_participants"
                        type="number" 
                        value={formData.max_participants}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700 pl-10" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-team-size">Tamanho Máximo do Time</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input 
                        id="max-team-size" 
                        name="max_team_size"
                        type="number" 
                        value={formData.max_team_size}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700 pl-10" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-fee">Taxa de Inscrição (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input 
                        id="registration-fee" 
                        name="registration_fee"
                        type="number" 
                        value={formData.registration_fee}
                        onChange={handleInputChange}
                        className="bg-zinc-800 border-zinc-700 pl-10" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Programação do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Dia 1</h3>
                    <Button variant="outline" size="sm" className="border-zinc-700">
                      <Plus className="h-4 w-4 mr-1.5" /> Adicionar Atividade
                    </Button>
                  </div>

                  <div className="bg-zinc-800/50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_auto] gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity-time-1">Horário</Label>
                        <Input
                          id="activity-time-1"
                          type="time"
                          defaultValue="09:00"
                          className="bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activity-title-1">Atividade</Label>
                        <Input
                          id="activity-title-1"
                          defaultValue="Credenciamento"
                          className="bg-zinc-800 border-zinc-700"
                        />
                        <Input
                          placeholder="Descrição (opcional)"
                          defaultValue="Recepção e entrega de kits"
                          className="bg-zinc-800 border-zinc-700 mt-2"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes" className="space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle>Premiação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-place">1º Lugar</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input
                        id="first-place"
                        type="number"
                        placeholder="Valor em R$"
                        className="bg-zinc-800 border-zinc-700 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="second-place">2º Lugar</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input
                        id="second-place"
                        type="number"
                        placeholder="Valor em R$"
                        className="bg-zinc-800 border-zinc-700 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="third-place">3º Lugar</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500" />
                      <Input
                        id="third-place"
                        type="number"
                        placeholder="Valor em R$"
                        className="bg-zinc-800 border-zinc-700 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                HackingTorch
              </span>
            </div>
            <div className="flex gap-4 text-zinc-500 text-sm">
              <Link href="#" className="hover:text-orange-400">
                Sobre
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Contato
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Termos
              </Link>
              <Link href="#" className="hover:text-orange-400">
                Privacidade
              </Link>
            </div>
            <div className="text-zinc-500 text-sm">© 2025 HackingTorch. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
