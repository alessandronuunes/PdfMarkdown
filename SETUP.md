# 🚀 Guia de Setup Rápido

## ⚡ Setup em 3 Passos

### 1️⃣ Clone e Instale
```bash
git clone https://github.com/seu-usuario/PdfMarkdown.git
cd PdfMarkdown
npm install
python3 -m pip install pymupdf
```

### 2️⃣ Configure APIs (Opcional)
```bash
# Para usar IA (recomendado)
cp .env.example .env
nano .env  # Adicione suas chaves API
```

### 3️⃣ Teste
```bash
# Adicione um PDF na pasta storage/
# Teste básico (gratuito)
node test-converter.js storage/seu-arquivo.pdf

# Teste com IA (melhor qualidade)
node hybrid-converter.js storage/seu-arquivo.pdf openai
```

## 🔑 Obter Chaves API

### OpenAI (Recomendado)
1. 🔗 [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crie conta → Ganhe $5 grátis
3. Gere API key
4. Cole no `.env`: `OPENAI_API_KEY=sua_chave`

### Claude (Alternativa)
1. 🔗 [console.anthropic.com/account/keys](https://console.anthropic.com/account/keys)
2. Crie conta → Ganhe $5 grátis
3. Gere API key  
4. Cole no `.env`: `ANTHROPIC_API_KEY=sua_chave`

## 🎯 Qual Método Usar?

| Situação | Método Recomendado |
|----------|-------------------|
| **Teste rápido** | `node test-converter.js` (gratuito) |
| **Documentos técnicos** | Claude Web (manual, máxima qualidade) |
| **Automação** | `node hybrid-converter.js arquivo.pdf openai` |
| **Sem custo** | `node test-converter.js` ou `node hybrid-converter.js arquivo.pdf basic` |

## 🔧 Solução de Problemas

### ❌ "Command not found: python3"
```bash
# macOS: 
brew install python3
# Ubuntu: 
sudo apt install python3-pip
# Windows: 
# Baixe de python.org
```

### ❌ "ModuleNotFoundError: No module named 'fitz'"
```bash
python3 -m pip install --upgrade pymupdf
# ou
pip3 install pymupdf
```

### ❌ "OPENAI_API_KEY não configurada"
- Copie `.env.example` para `.env`
- Adicione sua chave API do OpenAI
- Verifique se não há espaços extras

## 📝 Exemplo Completo

```bash
# 1. Setup inicial
git clone https://github.com/seu-usuario/PdfMarkdown.git
cd PdfMarkdown
npm install
python3 -m pip install pymupdf

# 2. Configurar OpenAI
cp .env.example .env
echo "OPENAI_API_KEY=sk-proj-sua_chave_aqui" >> .env

# 3. Adicionar PDF
cp ~/Downloads/documento.pdf storage/

# 4. Converter
node hybrid-converter.js storage/documento.pdf

# 5. Ver resultado
ls output/
cat output/documento-openai.md
```

## 💡 Dicas

- 📄 **PDFs pequenos**: Melhor qualidade de conversão
- 🔄 **Compare métodos**: Teste basic vs IA para ver a diferença
- 💰 **Custos baixos**: ~$0.01-0.05 por PDF com IA
- 📋 **Documentos técnicos**: Use Claude Web para máxima qualidade
- ⚡ **Automação**: Use APIs para processar em lote