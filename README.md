# HackingTorch

Plataforma para gerenciamento de eventos de tecnologia, incluindo hackathons, workshops e conferências.

## 🚀 Tecnologias

- Next.js 14
- TypeScript
- Supabase (PostgreSQL + Auth)
- Google Wallet API
- Tailwind CSS
- Shadcn/ui

## 📋 Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no Supabase
- Conta no Google Cloud Platform

## 🔧 Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/hackingtorch.git
cd hackingtorch
```

2. Instale as dependências:
```bash
npm install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# No Windows (PowerShell):
Copy-Item .env.example .env.local

# No Linux/Mac:
cp .env.example .env.local
```

4. Configure o Supabase:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Copie as credenciais do projeto para o arquivo `.env.local`
   - Execute o script de configuração:
   ```bash
   # No Windows (PowerShell):
   .\scripts\setup.ps1

   # No Linux/Mac:
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

5. Configure o Google Wallet:
   - Crie um projeto no [Google Cloud Platform](https://console.cloud.google.com)
   - Habilite a API do Google Wallet
   - Crie uma conta de serviço
   - Gere uma chave privada
   - Copie as credenciais para o arquivo `.env.local`

## 🏃‍♂️ Executando o projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
pnpm dev
```

2. Acesse `http://localhost:3000`

## 📦 Estrutura do Projeto

```
hackingtorch/
├── app/                # Rotas e páginas da aplicação
├── components/         # Componentes React reutilizáveis
├── lib/               # Utilitários e configurações
├── public/            # Arquivos estáticos
├── styles/            # Estilos globais
├── types/             # Definições de tipos TypeScript
└── supabase/          # Configurações e migrações do Supabase
```

## 🔐 Autenticação

O projeto usa autenticação do Supabase com os seguintes tipos de usuários:
- Participante
- Organizador
- Administrador

## 🎫 Google Wallet

O projeto integra com o Google Wallet para:
- Emissão de ingressos
- Certificados de participação
- Credenciais de acesso

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 