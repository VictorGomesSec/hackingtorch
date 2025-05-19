"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { supabaseConfig } from "./config"

// Função para validar a configuração do Supabase
const validateSupabaseConfig = () => {
  if (!supabaseConfig.isValid()) {
    throw new Error("Configuração do Supabase inválida. Verifique as variáveis de ambiente.")
  }
}

// Função para obter o cliente Supabase
export function createBrowserSupabaseClient() {
  try {
    // Validar configuração antes de criar o cliente
    validateSupabaseConfig()

    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
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
export const supabase = createBrowserSupabaseClient
export const createClientSupabaseClient = createBrowserSupabaseClient
