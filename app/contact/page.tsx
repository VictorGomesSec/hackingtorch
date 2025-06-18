import { Flame } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
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
        
        <h1 className="text-4xl font-bold mb-6">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Informações de Contato</h2>
            <div className="space-y-4">
              <p className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <a href="mailto:contato@hackingtorch.com" className="text-orange-400 hover:underline">
                  contato@hackingtorch.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Telefone:</span>
                <span>(11) 99999-9999</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Endereço:</span>
                <span>São Paulo, SP - Brasil</span>
              </p>
            </div>
          </div>
          
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome
                </label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Sua mensagem" className="min-h-[150px]" />
              </div>
              
              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
