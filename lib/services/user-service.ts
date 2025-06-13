import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

const supabase = createBrowserSupabaseClient()

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Erro ao buscar perfil:", error)
    return null
  }

  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar perfil:", error)
    return null
  }

  return data
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}-${Math.random()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

  if (uploadError) {
    console.error("Erro ao fazer upload do avatar:", uploadError)
    return null
  }

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId)

  if (updateError) {
    console.error("Erro ao atualizar URL do avatar:", updateError)
    return null
  }

  return publicUrl
}

// Função para o servidor
export async function getProfileServer(userId: string) {
  const supabaseServer = createServerClient()

  const { data, error } = await supabaseServer.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Erro ao buscar perfil:", error)
    return null
  }

  return data
}
