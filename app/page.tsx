"use client"

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

export default function HomePage() {
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
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Link href="/event/details" key={item}>
                    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10" role="article">
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-orange-500/80 mix-blend-multiply" />
                        <Image
                          src={`/placeholder.svg?height=200&width=400&text=Hackathon%20${item}`}
                          alt={`Hackathon ${item}`}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                          priority={item <= 3}
                          loading={item <= 3 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Badge className="absolute top-3 right-3 bg-black/70 text-white">
                          {item % 2 === 0 ? "Online" : "Presencial"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">Hackathon Future Tech {item}</h3>
                          <Badge variant="outline" className="border-orange-500/50 text-orange-400">
                            {item % 3 === 0 ? "AI" : item % 2 === 0 ? "Web3" : "IoT"}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                          Um evento incrível para desenvolvedores, designers e entusiastas de tecnologia.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                          <Calendar className="h-4 w-4" />
                          <span>12-14 Jun, 2025</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((avatar) => (
                            <Avatar key={avatar} className="border-2 border-zinc-900 h-6 w-6">
                              <AvatarImage 
                                src={`/placeholder.svg?height=24&width=24&text=${avatar}`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=24&width=24&text=?"
                                }}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-red-600 to-orange-500 text-xs">
                                {avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border-2 border-zinc-900">
                            +42
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame className="h-4 w-4" />
                          <span className="text-sm font-medium">{120 + item * 10}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
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
