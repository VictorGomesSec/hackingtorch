import { NextResponse } from 'next/server'
import { GoogleWalletService } from '@/lib/google-wallet'

export async function POST(request: Request) {
  try {
    const ticketData = await request.json()
    
    const walletService = GoogleWalletService.getInstance()
    const ticket = await walletService.createEventTicket(ticketData)
    
    return NextResponse.json({ 
      success: true, 
      ticket,
      saveUrl: `https://pay.google.com/gp/v/save/${ticket.id}`
    })
  } catch (error) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    )
  }
}
