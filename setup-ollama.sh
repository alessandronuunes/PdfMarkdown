#!/bin/bash

echo "🚀 Configurando Ollama no macOS..."

# 1. Instalar Ollama
echo "📦 Instalando Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.ai/install.sh | sh
else
    echo "✅ Ollama já instalado"
fi

# 2. Iniciar serviço (se não estiver rodando)
echo "🔄 Iniciando serviço Ollama..."
if ! pgrep ollama > /dev/null; then
    ollama serve &
    sleep 3
else
    echo "✅ Ollama já está rodando"
fi

# 3. Baixar modelo recomendado
echo "⬇️  Baixando modelo llama3.1:8b (4.7GB)..."
echo "⚠️  Isso pode demorar alguns minutos..."
ollama pull llama3.1:8b

# 4. Testar modelo
echo "🧪 Testando modelo..."
echo "Teste: convertendo texto simples..." | ollama run llama3.1:8b "Converta este texto para markdown estruturado: "

echo ""
echo "✅ Setup completo! Ollama configurado e pronto para usar."
echo ""
echo "📋 Modelos disponíveis:"
ollama list
echo ""
echo "🚀 Para usar: AI_METHOD=ollama node hybrid-converter.js seu-arquivo.pdf"