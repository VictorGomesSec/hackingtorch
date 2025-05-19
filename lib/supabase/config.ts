// Configuração centralizada do Supabase
export const supabaseConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  // Função para validar email
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Função para verificar se a configuração é válida
  isValid: () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error("Variáveis de ambiente do Supabase não estão definidas")
      console.error("NEXT_PUBLIC_SUPABASE_URL:", url)
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", key ? "Definida" : "Não definida")
      return false
    }

    // Verificar se a URL é válida
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.hostname.includes("supabase.co")) {
        console.error("URL do Supabase inválida: deve ser um domínio supabase.co")
        return false
      }
    } catch (e) {
      console.error("URL do Supabase inválida:", url)
      return false
    }

    // Verificar se a chave tem o formato esperado
    if (!key.startsWith("eyJ")) {
      console.error("Chave do Supabase inválida: deve começar com 'eyJ'")
      return false
    }

    // Verificar se a chave tem o tamanho esperado
    if (key.length < 100) {
      console.error("Chave do Supabase inválida: tamanho incorreto")
      return false
    }

    return true
  },

  // Função para validar a conexão com o Supabase
  async validateConnection() {
    if (!this.isValid()) {
      return false
    }

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        headers: {
          "apikey": this.supabaseKey,
          "Authorization": `Bearer ${this.supabaseKey}`
        }
      })

      if (!response.ok) {
        console.error("Erro ao conectar com o Supabase:", response.statusText)
        return false
      }

      return true
    } catch (error) {
      console.error("Erro ao validar conexão com o Supabase:", error)
      return false
    }
  }
}
