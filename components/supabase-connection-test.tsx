"use client"

import { useEffect, useState } from "react"
import { testSupabaseConnection } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const checkConnection = async () => {
    try {
      setIsRetrying(true)
      setError(null)
      const connected = await testSupabaseConnection()
      setIsConnected(connected)
      if (!connected) {
        setError("Não foi possível conectar ao Supabase")
      }
    } catch (err) {
      setIsConnected(false)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (isConnected === null) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          Testando conexão com o Supabase...
        </p>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <p className="text-green-800 dark:text-green-200">
          Conectado ao Supabase com sucesso!
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <div>
          <p className="text-red-800 dark:text-red-200 font-medium">
            Erro ao conectar com o Supabase
          </p>
          {error && (
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={checkConnection}
        disabled={isRetrying}
      >
        {isRetrying ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Tentando novamente...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </>
        )}
      </Button>
    </div>
  )
}
