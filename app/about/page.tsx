import { Flame } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
        
        <h1 className="text-4xl font-bold mb-6">Sobre o HackingTorch</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg mb-4">
            O HackingTorch é uma plataforma inovadora dedicada a conectar desenvolvedores, designers e entusiastas de tecnologia através de eventos como hackathons, ideathons e workshops.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Nossa Missão</h2>
          <p className="mb-4">
            Nossa missão é democratizar o acesso a eventos de tecnologia, criando um espaço onde ideias inovadoras podem florescer e conexões valiosas podem ser estabelecidas.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">O Que Oferecemos</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Plataforma completa para gerenciamento de eventos</li>
            <li>Comunidade ativa de desenvolvedores e criadores</li>
            <li>Recursos para organizadores de eventos</li>
            <li>Networking e oportunidades de carreira</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 