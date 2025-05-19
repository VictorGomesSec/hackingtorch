#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando configuração do projeto HackingTorch...${NC}\n"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js não encontrado. Por favor, instale o Node.js primeiro.${NC}"
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm não encontrado. Por favor, instale o npm primeiro.${NC}"
    exit 1
fi

# Instalar dependências
echo -e "${YELLOW}Instalando dependências...${NC}"
npm install

# Verificar se o arquivo .env.local existe
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Criando arquivo .env.local...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}Arquivo .env.local criado. Por favor, configure as variáveis de ambiente.${NC}"
fi

# Iniciar o Supabase localmente
echo -e "${YELLOW}Iniciando Supabase localmente...${NC}"
npx supabase start

# Aplicar migrações
echo -e "${YELLOW}Aplicando migrações do banco de dados...${NC}"
npx supabase db reset

echo -e "\n${GREEN}Configuração concluída!${NC}"
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente no arquivo .env.local"
echo "2. Crie um projeto no Google Cloud Platform e configure o Google Wallet"
echo "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento" 