import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase/server"
import type { PostgrestError } from "@supabase/supabase-js"

export type Event = {
  id: string
  title: string
  name: string
  description: string
  start_date: string
  end_date: string
  location: string
  status: "draft" | "published" | "completed" | "cancelled"
  created_at: string
  organizer_id: string
  cover_image_url?: string
  max_participants?: number
  max_team_size?: number
  registration_fee?: number
  is_featured: boolean
  categories?: string[]
  profiles?: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export type EventCreateInput = Omit<Event, "id" | "created_at" | "updated_at">
export type EventUpdateInput = Partial<Omit<Event, "id" | "created_at" | "updated_at">>

export async function getEvents(supabase: SupabaseClient<Database>) {
  let query = supabase
    .from("events")
    .select(`
      *,
      event_categories (
        category
      ),
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }

  return data.map((event) => ({
    ...event,
    categories: event.event_categories?.map((ec: { category: string }) => ec.category) || [],
  }))
}

export async function getEventById(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      event_categories (
        category
      ),
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erro ao buscar evento:", error)
    return null
  }

  return {
    ...data,
    categories: data.event_categories?.map((ec: { category: string }) => ec.category) || [],
  }
}

export async function createEvent(supabase: SupabaseClient<Database>, eventData: Omit<Event, "id" | "created_at">) {
  const { data, error } = await supabase.from("events").insert(eventData).select().single()

  return { event: data, error }
}

export async function updateEvent(supabase: SupabaseClient<Database>, id: string, eventData: Partial<Event>) {
  const { data, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", id)
    .select()
    .single()

  return { event: data, error }
}

export async function deleteEvent(supabase: SupabaseClient<Database>, id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id)

  return { error }
}

// Função para o servidor
export async function getEventsServer(
  options: {
    limit?: number
    featured?: boolean
    status?: string
    type?: string
    upcoming?: boolean
  } = {},
): Promise<Event[]> {
  try {
    const supabaseServer = createServerClient()
    const { limit = 10, featured, status = "published", type, upcoming } = options

    let query = supabaseServer
      .from("events")
      .select(`
        *,
        event_categories (
          category_id,
          categories (
            name
          )
        )
      `)
      .eq("status", status)

    if (featured) {
      query = query.eq("is_featured", true)
    }

    if (type) {
      query = query.eq("event_type", type)
    }

    if (upcoming) {
      query = query.gt("start_date", new Date().toISOString())
    }

    const { data, error } = await query.order("start_date", { ascending: true }).limit(limit)

    if (error) {
      console.error("Erro ao buscar eventos:", error)
      return []
    }

    // Transformar os dados para um formato mais fácil de usar
    return data.map((event) => {
      const categories = event.event_categories?.map((ec: any) => ec.categories.name) || []
      return {
        ...event,
        categories,
      }
    })
  } catch (error) {
    console.error("Erro inesperado ao buscar eventos no servidor:", error)
    return []
  }
}
