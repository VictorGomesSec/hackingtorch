import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    return false
  }
}
