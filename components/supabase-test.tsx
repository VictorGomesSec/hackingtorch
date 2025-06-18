'use client'

import { useEffect, useState } from 'react'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'

export function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const connected = await testSupabaseConnection()
        setIsConnected(connected)
        if (!connected) {
          setError('Falha na conexão com o Supabase')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  if (isConnected === null) {
    return <div>Testando conexão com Supabase...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Erro: {error}</p>
        <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p>Chave: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10)}...</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-100 text-green-700 rounded">
      Conexão com Supabase estabelecida com sucesso!
    </div>
  )
}
