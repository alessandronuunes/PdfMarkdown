#!/bin/bash

echo "🤖 Configurando PDF to Markdown com Claude AI..."
echo ""

# 1. Verificar se arquivo .env existe
if [ ! -f ".env" ]; then
    echo "📄 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "🔑 CONFIGURAÇÃO NECESSÁRIA:"
echo ""
echo "1. Acesse: https://console.anthropic.com/account/keys"
echo "2. Crie uma conta (ganhe $5 grátis)"
echo "3. Gere uma API key"
echo "4. Edite o arquivo .env e adicione sua chave:"
echo ""
echo "   ANTHROPIC_API_KEY=sua_chave_aqui"
echo "   AI_METHOD=claude"
echo ""
echo "💰 CUSTOS ESTIMADOS (Claude Haiku):"
echo "   • PDF pequeno (10 páginas): ~$0.002"
echo "   • PDF médio (50 páginas): ~$0.008"  
echo "   • PDF grande (200 páginas): ~$0.030"
echo ""
echo "🏆 VANTAGENS DO CLAUDE:"
echo "   ✅ Excelente qualidade de conversão"
echo "   ✅ Melhor entendimento de contexto"
echo "   ✅ Formatação markdown superior"
echo "   ✅ Custos competitivos"
echo ""
echo "📋 COMO USAR:"
echo "   1. Configure a chave no .env"
echo "   2. Execute: node hybrid-converter.js seu-arquivo.pdf claude"
echo "   3. Resultado salvo em: output/arquivo-claude.md"
echo ""

# Verificar se dotenv está instalado
if [ ! -d "node_modules" ] || [ ! -d "node_modules/dotenv" ]; then
    echo "📦 Instalando dependências..."
    npm install dotenv
    echo "✅ Dependências instaladas"
fi

# Verificar se PyMuPDF está instalado
echo "🐍 Verificando PyMuPDF..."
if python3 -c "import fitz" 2>/dev/null; then
    echo "✅ PyMuPDF já instalado"
else
    echo "📦 Instalando PyMuPDF..."
    python3 -m pip install pymupdf
    echo "✅ PyMuPDF instalado"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Configure sua ANTHROPIC_API_KEY no arquivo .env"
echo "2. Teste: node hybrid-converter.js storage/seu-arquivo.pdf claude"
echo ""
echo "📁 Estrutura do projeto:"
echo "├── .env (suas configurações)"
echo "├── output/ (arquivos convertidos)"
echo "├── storage/ (seus PDFs)"
echo "└── hybrid-converter.js (conversor principal)"