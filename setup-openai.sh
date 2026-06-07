#!/bin/bash

echo "🚀 Configurando PDF to Markdown com OpenAI..."
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
echo "1. Acesse: https://platform.openai.com/api-keys"
echo "2. Crie uma conta (ganhe $5 grátis)"
echo "3. Gere uma API key"
echo "4. Edite o arquivo .env e adicione sua chave:"
echo ""
echo "   OPENAI_API_KEY=sua_chave_aqui"
echo ""
echo "💰 CUSTOS ESTIMADOS:"
echo "   • PDF pequeno (10 páginas): ~$0.005"
echo "   • PDF médio (50 páginas): ~$0.015"
echo "   • PDF grande (200 páginas): ~$0.050"
echo ""
echo "📋 COMO USAR:"
echo "   1. Configure a chave no .env"
echo "   2. Execute: node hybrid-converter.js seu-arquivo.pdf"
echo "   3. Resultado salvo em: output/arquivo-openai.md"
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
echo "1. Configure sua OPENAI_API_KEY no arquivo .env"
echo "2. Teste: node hybrid-converter.js storage/seu-arquivo.pdf"
echo ""
echo "📁 Estrutura do projeto:"
echo "├── .env (suas configurações)"
echo "├── output/ (arquivos convertidos)"
echo "├── storage/ (seus PDFs)"
echo "└── hybrid-converter.js (conversor principal)"