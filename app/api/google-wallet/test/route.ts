import { NextResponse } from 'next/server'
import { GoogleWalletService } from '@/lib/google-wallet'

export async function POST() {
  try {
    const walletService = GoogleWalletService.getInstance()
    
    // Tenta criar uma classe de teste
    const testClass = await walletService.createTicketClass({
      id: "test-class",
      eventName: "Teste de Conexão",
      eventDescription: "Teste de integração com Google Wallet",
      eventLocation: "Online",
      eventDate: new Date().toISOString().split('T')[0]
    })
    
    return NextResponse.json({ 
      success: true, 
      message: "Conexão com Google Wallet estabelecida com sucesso!",
      testClass
    })
  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    )
  }
}
