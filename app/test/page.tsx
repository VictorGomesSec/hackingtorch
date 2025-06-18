"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function TestPage() {
  const [walletTestResult, setWalletTestResult] = useState<string | null>(null)

  const testGoogleWallet = async () => {
    try {
      setWalletTestResult("Testando conexão com Google Wallet...")
      
      const response = await fetch('/api/google-wallet/test', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao testar conexão')
      }
      
      setWalletTestResult(data.message)
    } catch (error) {
      setWalletTestResult(`Erro ao conectar com Google Wallet: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Teste de Conexões</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão com Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <SupabaseConnectionTest />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste de Conexão com Google Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testGoogleWallet} className="mb-4">
              Testar Conexão com Google Wallet
            </Button>
            
            {walletTestResult && (
              <div className={`p-4 rounded-lg ${
                walletTestResult.includes("sucesso") 
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
              }`}>
                {walletTestResult}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
