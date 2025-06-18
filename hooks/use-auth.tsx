"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase/client" // Importação corrigida
import { supabaseConfig } from "@/lib/supabase/config" // Importar a configuração centralizada

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>
  signUp: (
    email: string,
    password: string,
    userData: Record<string, any>,
  ) => Promise<{ error: AuthError | Error | null; user: User | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>
  isConfigValid: boolean // Adicionado para expor a validade da configuração
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Usar a mesma instância do cliente Supabase em todo o componente
  const supabase = createBrowserSupabaseClient()
  const isConfigValid = supabaseConfig.isValid() // Obter a validade da configuração

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Erro ao obter sessão:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Erro inesperado ao obter sessão:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) {
        router.refresh()
      }
      return { error }
    } catch (error) {
      console.error("Erro no login:", error)
      return { error: error instanceof Error ? error : new Error("Erro desconhecido no login") }
    }
  }

  const signUp = async (email: string, password: string, userData: Record<string, any>) => {
    try {
      console.log("Iniciando registro com:", { email, userData })

      // A validação das variáveis de ambiente agora é feita por supabaseConfig.isValid()
      if (!isConfigValid) {
        console.error("Variáveis de ambiente do Supabase não estão definidas ou são inválidas.")
        return {
          error: new Error("Configuração do Supabase incompleta ou inválida. Contate o administrador."),
          user: null,
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      console.log("Resposta do registro:", { data, error })

      if (error) {
        console.error("Erro retornado pelo Supabase:", error)
      }

      return { error, user: data?.user || null }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return {
        error: error instanceof Error ? error : new Error("Erro desconhecido no registro"),
        user: null,
      }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
      router.refresh()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      console.error("Erro ao resetar senha:", error)
      return {
        error: error instanceof Error ? error : new Error("Erro desconhecido ao resetar senha"),
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        isConfigValid, // Passar a validade da configuração
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// A função useSupabaseConfigValid foi movida para dentro do AuthContext
// e é acessada via useAuth().isConfigValid

// Função utilitária para validar as variáveis de ambiente (reintroduzida para compatibilidade)
export function useSupabaseConfigValid() {
  // Esta função agora apenas delega para a validação centralizada
  // e é mantida para compatibilidade com código existente que a importa.
  return supabaseConfig.isValid()
}
