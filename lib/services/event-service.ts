import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase/server"
import type { PostgrestError } from "@supabase/supabase-js"

const supabase = createBrowserSupabaseClient()

export type Event = Database["public"]["Tables"]["events"]["Row"] & {
  profiles?: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export type EventCreateInput = Omit<Event, "id" | "created_at" | "updated_at">
export type EventUpdateInput = Partial<Omit<Event, "id" | "created_at" | "updated_at">>

// Classe de erro personalizada
export class EventServiceError extends Error {
  constructor(message: string, public code?: string, public originalError?: any) {
    super(message)
    this.name = 'EventServiceError'
  }
}

// Função para validar dados do evento
function validateEventData(eventData: Partial<Event>): void {
  if (eventData.start_date && eventData.end_date) {
    const startDate = new Date(eventData.start_date)
    const endDate = new Date(eventData.end_date)
    
    if (startDate > endDate) {
      throw new EventServiceError('A data de início deve ser anterior à data de término')
    }
  }
  
  if (eventData.name && eventData.name.length < 3) {
    throw new EventServiceError('O nome do evento deve ter pelo menos 3 caracteres')
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })

    if (error) {
      throw new EventServiceError('Erro ao buscar eventos', 'FETCH_ERROR', error)
    }

    return data || []
  } catch (error) {
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao buscar eventos', 'UNKNOWN_ERROR', error)
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    if (!eventId) {
      throw new EventServiceError('ID do evento é obrigatório', 'INVALID_INPUT')
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (error) {
      throw new EventServiceError('Erro ao buscar evento', 'FETCH_ERROR', error)
    }

    return data
  } catch (error) {
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao buscar evento', 'UNKNOWN_ERROR', error)
  }
}

export async function getOrganizerEvents(organizerId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Erro ao buscar eventos do organizador:", error)
    return []
  }

  return data || []
}

export async function createEvent(eventData: EventCreateInput): Promise<Event | null> {
  try {
    validateEventData(eventData)

    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single()

    if (error) {
      throw new EventServiceError('Erro ao criar evento', 'CREATE_ERROR', error)
    }

    return data
  } catch (error) {
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao criar evento', 'UNKNOWN_ERROR', error)
  }
}

export async function updateEvent(eventId: string, updates: EventUpdateInput): Promise<Event | null> {
  try {
    if (!eventId) {
      throw new EventServiceError('ID do evento é obrigatório', 'INVALID_INPUT')
    }

    validateEventData(updates)

    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single()

    if (error) {
      throw new EventServiceError('Erro ao atualizar evento', 'UPDATE_ERROR', error)
    }

    return data
  } catch (error) {
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao atualizar evento', 'UNKNOWN_ERROR', error)
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    if (!eventId) {
      throw new EventServiceError('ID do evento é obrigatório', 'INVALID_INPUT')
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)

    if (error) {
      throw new EventServiceError('Erro ao deletar evento', 'DELETE_ERROR', error)
    }

    return true
  } catch (error) {
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao deletar evento', 'UNKNOWN_ERROR', error)
  }
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
      throw new EventServiceError('Erro ao buscar eventos no servidor', 'SERVER_FETCH_ERROR', error)
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
    if (error instanceof EventServiceError) {
      throw error
    }
    throw new EventServiceError('Erro inesperado ao buscar eventos no servidor', 'UNKNOWN_ERROR', error)
  }
}
