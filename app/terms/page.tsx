import { Flame } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-xl bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              HackingTorch
            </span>
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">Termos de Uso</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-4">
            Última atualização: 1 de Março de 2024
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p className="mb-4">
            Ao acessar e usar o HackingTorch, você concorda em cumprir estes termos de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso do Serviço</h2>
          <p className="mb-4">
            O HackingTorch é uma plataforma para gerenciamento e participação em eventos de tecnologia. Você concorda em:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fornecer informações precisas e atualizadas</li>
            <li>Manter a confidencialidade de sua conta</li>
            <li>Não usar o serviço para fins ilegais</li>
            <li>Respeitar outros usuários e organizadores</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Responsabilidades</h2>
          <p className="mb-4">
            Você é responsável por todas as atividades que ocorrem em sua conta e por manter a segurança de suas credenciais de login.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Modificações</h2>
          <p className="mb-4">
            Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
          </p>
        </div>
      </div>
    </div>
  )
} 