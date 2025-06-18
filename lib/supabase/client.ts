"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"
import { supabaseConfig } from "./config"

// Função para validar a configuração do Supabase
const validateSupabaseConfig = () => {
  if (!supabaseConfig.isValid()) {
    throw new Error("Configuração do Supabase inválida. Verifique as variáveis de ambiente.")
  }
}

// Função para verificar se está no ambiente do navegador
const isBrowser = () => typeof window !== "undefined"

// Função para obter o cliente Supabase
export function createBrowserSupabaseClient() {
  try {
    // Validar configuração antes de criar o cliente
    validateSupabaseConfig()

    return createClient<Database>(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => {
            if (!isBrowser()) return null
            try {
              return localStorage.getItem(key)
            } catch (error) {
              console.error("Erro ao obter item do localStorage:", error)
              return null
            }
          },
          setItem: (key, value) => {
            if (!isBrowser()) return
            try {
              localStorage.setItem(key, value)
            } catch (error) {
              console.error("Erro ao definir item no localStorage:", error)
            }
          },
          removeItem: (key) => {
            if (!isBrowser()) return
            try {
              localStorage.removeItem(key)
            } catch (error) {
              console.error("Erro ao remover item do localStorage:", error)
            }
          },
        },
      },
    })
  } catch (error) {
    console.error("Erro ao inicializar cliente Supabase:", error)
    throw error
  }
}

// Função para testar a conexão com o Supabase
export async function testSupabaseConnection() {
  try {
    const client = createBrowserSupabaseClient()
    if (!client) {
      throw new Error("Cliente Supabase não inicializado")
    }

    const { data, error } = await client.auth.getSession()

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Erro ao testar conexão com Supabase:", error)
    return false
  }
}

// Para compatibilidade com código existente
export const createClientSupabaseClient = createBrowserSupabaseClient

export const supabase = createBrowserSupabaseClient
