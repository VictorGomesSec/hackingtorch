import { Flame } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
        
        <h1 className="text-4xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-4">
            Última atualização: 1 de Março de 2024
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Coleta de Informações</h2>
          <p className="mb-4">
            Coletamos informações que você nos fornece diretamente, incluindo:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Nome e informações de contato</li>
            <li>Informações de perfil</li>
            <li>Dados de participação em eventos</li>
            <li>Comunicações com outros usuários</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso das Informações</h2>
          <p className="mb-4">
            Utilizamos suas informações para:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Comunicar-se com você sobre eventos e atualizações</li>
            <li>Personalizar sua experiência</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p className="mb-4">
            Não compartilhamos suas informações pessoais com terceiros, exceto quando:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Você autoriza explicitamente</li>
            <li>É necessário para a realização de eventos</li>
            <li>Exigido por lei</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Seus Direitos</h2>
          <p className="mb-4">
            Você tem o direito de:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Acessar suas informações pessoais</li>
            <li>Corrigir dados imprecisos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Retirar seu consentimento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
