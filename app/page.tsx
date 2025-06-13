"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupabaseConnectionTest } from "@/components/supabase-connection-test"
import { SupabaseTest } from '@/components/supabase-test'
import { createBrowserSupabaseClient } from '@/utils/supabase/client'
import { getEventsServer } from '@/lib/services/event-service'

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEventsServer({ status: "published" })
        setEvents(eventsData)
      } catch (error) {
        console.error("Erro ao buscar eventos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Descubra, participe e gerencie <br className="hidden sm:inline" />
              eventos de tecnologia
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              HackingTorch é a plataforma ideal para hackathons, ideathons e outros eventos de tecnologia.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/register">
              <Button size="lg" aria-label="Criar uma nova conta">Começar agora</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" aria-label="Ver todos os eventos">
                Explorar eventos
              </Button>
            </Link>
          </div>
        </section>

        {/* Status do Supabase */}
        <div className="container mx-auto px-4 mb-8">
          <SupabaseConnectionTest />
        </div>

        {/* Events Section */}
        <section className="container mx-auto px-4 py-8">
          <Tabs defaultValue="upcoming" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Eventos em destaque</h2>
              <TabsList className="bg-zinc-900/50" aria-label="Filtrar eventos">
                <TabsTrigger value="upcoming">Próximos</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="past">Passados</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : events.length === 0 ? (
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                      <Calendar className="h-12 w-12 text-zinc-600 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Nenhum evento encontrado</h3>
                      <p className="text-zinc-400 mb-6">Não há eventos disponíveis no momento.</p>
                    </CardContent>
                  </Card>
                ) : (
                  events.map((event) => (
                    <Link href={`/event/details?id=${event.id}`} key={event.id}>
                      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-orange-500/80 mix-blend-multiply" />
                          <Image
                            src={event.cover_image_url || `/placeholder.svg?height=200&width=400&text=${event.name}`}
                            alt={event.name}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                          <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                            {event.event_type === "online" ? "Online" : "Presencial"}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{event.name}</h3>
                            <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                              {event.categories?.[0] || "Geral"}
                            </Badge>
                          </div>
                          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                            {event.description || "Sem descrição"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString("pt-BR")} -{" "}
                              {new Date(event.end_date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {event.profiles?.slice(0, 3).map((profile, index) => (
                              <Avatar key={index} className="border-2 border-zinc-900 h-6 w-6">
                                <AvatarImage 
                                  src={profile.avatar_url || `/placeholder.svg?height=24&width=24&text=${profile.first_name?.[0]}`}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=24&width=24&text=?"
                                  }}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500 text-xs">
                                  {profile.first_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {event.profiles?.length > 3 && (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border-2 border-zinc-900">
                                +{event.profiles.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-orange-400">
                            <Flame className="h-4 w-4" />
                            <span className="text-sm font-medium">{event.participants_count || 0}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex justify-center items-center p-12 text-zinc-500">
                  Em breve: Eventos em alta
                </div>
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex justify-center items-center p-12 text-zinc-500">
                  Em breve: Eventos passados
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Footer */}
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
              <Link href="/about" className="hover:text-orange-400">
                Sobre
              </Link>
              <Link href="/contact" className="hover:text-orange-400">
                Contato
              </Link>
              <Link href="/terms" className="hover:text-orange-400">
                Termos
              </Link>
              <Link href="/privacy" className="hover:text-orange-400">
                Privacidade
              </Link>
            </div>
            <div className="text-zinc-500 text-sm">© 2025 HackingTorch. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>

      <div className="container mx-auto px-4 py-8">
        <SupabaseTest />
      </div>
    </div>
  )
}
