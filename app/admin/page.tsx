"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Award, Settings } from "lucide-react"
import { createBrowserSupabaseClient } from "@/utils/supabase/client"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    userCount: 0,
    eventCount: 0,
    teamCount: 0,
    submissionCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    async function fetchStats() {
      try {
        // Obter contagem de usuários
        const { count: userCount, error: userError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        // Obter contagem de eventos
        const { count: eventCount, error: eventError } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })

        // Obter contagem de equipes
        const { count: teamCount, error: teamError } = await supabase
          .from("teams")
          .select("*", { count: "exact", head: true })

        // Obter contagem de submissões
        const { count: submissionCount, error: submissionError } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })

        if (userError || eventError || teamError || submissionError) {
          console.error("Erro ao buscar estatísticas:", { userError, eventError, teamError, submissionError })
        }

        setStats({
          userCount: userCount || 0,
          eventCount: eventCount || 0,
          teamCount: teamCount || 0,
          submissionCount: submissionCount || 0,
        })
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Carregando estatísticas...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel de administração da plataforma HackingTorch.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-muted-foreground">Usuários registrados na plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventCount}</div>
            <p className="text-xs text-muted-foreground">Eventos criados na plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamCount}</div>
            <p className="text-xs text-muted-foreground">Equipes formadas na plataforma</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Submissões</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissionCount}</div>
            <p className="text-xs text-muted-foreground">Projetos submetidos na plataforma</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <p className="text-sm">Novo usuário registrado: João Silva</p>
                <span className="ml-auto text-xs text-muted-foreground">Há 5 minutos</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-sm">Novo evento criado: Hackathon de IA</p>
                <span className="ml-auto text-xs text-muted-foreground">Há 2 horas</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                <p className="text-sm">Nova equipe formada: Tech Innovators</p>
                <span className="ml-auto text-xs text-muted-foreground">Há 1 dia</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                <p className="text-sm">Submissão de projeto: AI Assistant</p>
                <span className="ml-auto text-xs text-muted-foreground">Há 2 dias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link
                href="/admin/users"
                className="flex items-center rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Gerenciar Usuários</span>
              </Link>
              <Link
                href="/admin/events"
                className="flex items-center rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Gerenciar Eventos</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações da Plataforma</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
