"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface GoogleWalletTicketProps {
  ticketData: {
    eventId: string
    eventName: string
    eventDate: string
    eventLocation: string
    attendeeName: string
    attendeeEmail: string
    ticketType: string
    ticketId: string
  }
}

export function GoogleWalletTicket({ ticketData }: GoogleWalletTicketProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToWallet = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/google-wallet/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao adicionar ingresso')
      }
      
      // Abrir o Google Wallet em uma nova janela
      window.open(data.saveUrl, '_blank')
      
      toast({
        title: "Ingresso adicionado",
        description: "Seu ingresso foi adicionado ao Google Wallet com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao adicionar ingresso:', error)
      toast({
        title: "Erro ao adicionar ingresso",
        description: "Não foi possível adicionar o ingresso ao Google Wallet. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-zinc-900/50 border-zinc-800">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{ticketData.eventName}</h3>
          <p className="text-sm text-zinc-400">{ticketData.eventDate}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-zinc-400">Local:</span>
            <span>{ticketData.eventLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Participante:</span>
            <span>{ticketData.attendeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Tipo:</span>
            <span>{ticketData.ticketType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Número do ingresso:</span>
            <span>{ticketData.ticketId}</span>
          </div>
        </div>

        <Button
          onClick={handleAddToWallet}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        >
          {isLoading ? "Adicionando..." : "Adicionar ao Google Wallet"}
        </Button>
      </div>
    </Card>
  )
} 