# Cores para output
$RED = [System.ConsoleColor]::Red
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow

Write-Host "Iniciando configuração do projeto HackingTorch..." -ForegroundColor $YELLOW
Write-Host ""

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "Node.js não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor $RED
    exit 1
}

# Verificar se o npm está instalado
try {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor $GREEN
} catch {
    Write-Host "npm não encontrado. Por favor, instale o npm primeiro." -ForegroundColor $RED
    exit 1
}

# Instalar dependências
Write-Host "Instalando dependências..." -ForegroundColor $YELLOW
npm install

# Verificar se o arquivo .env.local existe
if (-not (Test-Path .env.local)) {
    Write-Host "Criando arquivo .env.local..." -ForegroundColor $YELLOW
    Copy-Item .env.example .env.local
    Write-Host "Arquivo .env.local criado. Por favor, configure as variáveis de ambiente." -ForegroundColor $GREEN
}

Write-Host "`nConfiguração concluída!" -ForegroundColor $GREEN
Write-Host "Próximos passos:" -ForegroundColor $YELLOW
Write-Host "1. Configure as variáveis de ambiente no arquivo .env.local com suas credenciais do Supabase"
Write-Host "2. Crie um projeto no Google Cloud Platform e configure o Google Wallet"
Write-Host "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento" 