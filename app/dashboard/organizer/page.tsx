"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Flame,
  User,
  Settings,
  Bell,
  LogOut,
  Search,
  Calendar,
  Plus,
  BarChart,
  Award,
  Edit,
  Trash2,
  Eye,
  Filter,
  Users,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/hooks/use-auth"
import { getOrganizerEvents, deleteEvent, type Event } from "@/lib/services/event-service"
import { createBrowserSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export default function OrganizerDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    if (user?.id) {
      loadEvents()
    }
  }, [user?.id])

  const loadEvents = async () => {
    if (!user?.id) return
    const eventsData = await getOrganizerEvents(user.id)
    setEvents(eventsData)
    setLoading(false)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return

    const success = await deleteEvent(eventId)
    if (success) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
      toast({
        title: "Evento excluído com sucesso!",
      })
    } else {
      toast({
        title: "Erro ao excluir evento",
        description: "Não foi possível excluir o evento. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Carregando eventos...</p>
        </div>
      </div>
    )
  }

  const totalParticipants = events.reduce((acc, event) => acc + (event.max_participants || 0), 0)
  const activeEvents = events.filter((event) => event.status === "published").length
  const completedEvents = events.filter((event) => event.status === "completed").length

  return (
    <AuthGuard>
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
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500">
                      {user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard do Organizador</h1>
              <p className="text-zinc-400">Gerencie seus eventos e acompanhe o desempenho</p>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400">
              <Link href="/dashboard/create-event" className="flex items-center text-white">
                <Plus className="h-4 w-4 mr-1.5" /> Criar Evento
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <p className="text-xs text-muted-foreground">Em todos os eventos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeEvents}</div>
                <p className="text-xs text-muted-foreground">Eventos em andamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Concluídos</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedEvents}</div>
                <p className="text-xs text-muted-foreground">Eventos finalizados</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <TabsList className="bg-zinc-900/50">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="draft">Rascunhos</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="border-zinc-700">
                  <Filter className="h-4 w-4 mr-1.5" /> Filtrar
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Buscar eventos..."
                    className="w-64 bg-zinc-900/80 border-zinc-800 pl-9 h-9 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : events.length === 0 ? (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
                    <p className="text-zinc-400 mb-6">Você ainda não criou nenhum evento.</p>
                    <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400">
                      <Link href="/dashboard/create-event" className="flex items-center text-white">
                        <Plus className="h-4 w-4 mr-1.5" /> Criar Primeiro Evento
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.start_date).toLocaleDateString()} -{" "}
                            {new Date(event.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
                          <Users className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {events
                    .filter((event) => event.status === "published")
                    .map((event) => (
                      <Card key={event.id} className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
                              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString()} -{" "}
                              {new Date(event.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
                            <Users className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {events
                    .filter((event) => event.status === "draft")
                    .map((event) => (
                      <Card key={event.id} className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
                              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString()} -{" "}
                              {new Date(event.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
                            <Users className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {events
                    .filter((event) => event.status === "completed")
                    .map((event) => (
                      <Card key={event.id} className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
                              <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-zinc-800 cursor-pointer text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString()} -{" "}
                              {new Date(event.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
                            <Users className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
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
    </AuthGuard>
  )
}
