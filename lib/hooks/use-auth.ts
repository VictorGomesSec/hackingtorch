import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("useAuth - Sessão atual:", session ? "Existe" : "Não existe")
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("useAuth - Mudança de estado:", _event)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    const supabase = createBrowserSupabaseClient()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      // Criar perfil do usuário
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: email,
          user_type: userData.user_type,
        })

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError)
          throw profileError
        }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error("Erro no registro:", error)
      return { user: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabase = createBrowserSupabaseClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log("useAuth - Login bem sucedido:", data.user?.id)

      // Atualizar o estado do usuário imediatamente
      setUser(data.user)
      setLoading(false)

      // Forçar atualização da página após login
      window.location.href = "/dashboard"

      return { user: data.user, error: null }
    } catch (error) {
      console.error("Erro no login:", error)
      return { user: null, error }
    }
  }

  const signOut = async () => {
    const supabase = createBrowserSupabaseClient()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
} 