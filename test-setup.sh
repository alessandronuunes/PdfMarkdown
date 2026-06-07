#!/bin/bash

echo "🧪 Testando Setup do PDF to Markdown Converter"
echo ""

# Verificar Node.js
echo "📋 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js encontrado: $NODE_VERSION"
else
    echo "❌ Node.js não encontrado! Instale: https://nodejs.org"
    exit 1
fi

# Verificar Python
echo "📋 Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python encontrado: $PYTHON_VERSION"
else
    echo "❌ Python3 não encontrado! Instale: https://python.org"
    exit 1
fi

# Verificar PyMuPDF
echo "📋 Verificando PyMuPDF..."
if python3 -c "import fitz" 2>/dev/null; then
    echo "✅ PyMuPDF instalado"
else
    echo "⚠️ PyMuPDF não encontrado. Instalando..."
    python3 -m pip install pymupdf
fi

# Verificar dependências Node.js
echo "📋 Verificando dependências Node.js..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
else
    echo "⚠️ Dependências não encontradas. Instalando..."
    npm install
fi

# Verificar arquivo .env
echo "📋 Verificando configuração..."
if [ -f ".env" ]; then
    echo "✅ Arquivo .env encontrado"
    if grep -q "sua_chave" .env; then
        echo "⚠️ Configure suas chaves API no arquivo .env"
    else
        echo "✅ Chaves API configuradas"
    fi
else
    echo "⚠️ Arquivo .env não encontrado. Criando..."
    cp .env.example .env
    echo "📝 Configure suas chaves API em: .env"
fi

# Teste básico
echo ""
echo "🧪 Executando teste básico..."
if [ -f "test-converter.js" ]; then
    echo "✅ test-converter.js encontrado"
else
    echo "❌ test-converter.js não encontrado!"
    exit 1
fi

if [ -f "hybrid-converter.js" ]; then
    echo "✅ hybrid-converter.js encontrado"
else
    echo "❌ hybrid-converter.js não encontrado!"
    exit 1
fi

# Verificar pastas
echo ""
echo "📁 Verificando estrutura de pastas..."
if [ -d "output" ]; then
    echo "✅ Pasta output/ encontrada"
else
    echo "⚠️ Criando pasta output/"
    mkdir -p output
fi

if [ -d "storage" ]; then
    echo "✅ Pasta storage/ encontrada"
else
    echo "⚠️ Criando pasta storage/"
    mkdir -p storage
fi

echo ""
echo "🎉 Setup verificado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Adicione um PDF na pasta storage/"
echo "2. Configure suas chaves API no arquivo .env (opcional)"
echo "3. Teste: node test-converter.js storage/seu-arquivo.pdf"
echo "4. Teste IA: node hybrid-converter.js storage/seu-arquivo.pdf openai"
echo ""
echo "📖 Leia o arquivo SETUP.md para instruções detalhadas"