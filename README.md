# 📄 PDF to Markdown Converter

🔄 **Conversor híbrido de PDF para Markdown** com suporte a IA para máxima qualidade

## 📋 Sobre o Projeto

Este projeto converte arquivos PDF para formato Markdown utilizando uma **abordagem híbrida**:
- **Método básico**: 100% gratuito e local (PyMuPDF)
- **Método IA**: Alta qualidade usando OpenAI ou Claude APIs

**Desenvolvido como alternativa superior a serviços pagos limitados!**

### ✅ Características

- **🆓 Método Básico**: Totalmente gratuito usando PyMuPDF
- **🧠 Método IA**: Qualidade superior com OpenAI/Claude
- **🔒 Local**: Processamento na sua máquina, dados seguros
- **⚡ Flexível**: Escolha o método ideal para cada caso
- **📊 Análise**: Comparação automática de qualidade
- **🎯 Estruturado**: Sumários, tabelas e formatação profissional

## 🛠️ Instalação

### 1. Pré-requisitos

- **Node.js** (v14 ou superior)
- **Python 3** (v3.8 ou superior) 
- **Conta OpenAI ou Claude** (opcional, para IA)

### 2. Clone o repositório

```bash
git clone https://github.com/seu-usuario/PdfMarkdown.git
cd PdfMarkdown
```

### 3. Configuração Automática

```bash
# Para OpenAI
./setup-openai.sh

# Para Claude
./setup-claude.sh
```

### 4. Configuração Manual

```bash
# 1. Instalar dependências
npm install
python3 -m pip install pymupdf

# 2. Configurar APIs (copie e edite)
cp .env.example .env
nano .env
```

### 🔑 Como obter chaves API:

#### OpenAI:
1. Acesse [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crie conta (ganhe $5 grátis)
3. Gere nova API key
4. Adicione no arquivo `.env`: `OPENAI_API_KEY=sua_chave`

#### Claude:
1. Acesse [console.anthropic.com/account/keys](https://console.anthropic.com/account/keys)
2. Crie conta (ganhe $5 grátis)
3. Gere nova API key
4. Adicione no arquivo `.env`: `ANTHROPIC_API_KEY=sua_chave`

## 🚀 Como Usar

### 🧠 Conversão com IA (Recomendado)

```bash
# Método automático (usa configuração do .env)
node hybrid-converter.js seu-arquivo.pdf

# Forçar método específico
node hybrid-converter.js arquivo.pdf openai    # OpenAI GPT-4o-mini
node hybrid-converter.js arquivo.pdf claude    # Claude API
node hybrid-converter.js arquivo.pdf basic     # Gratuito sem IA
```

### ⚡ Conversão Básica (100% Gratuita)

```bash
# Conversão básica sem IA
node test-converter.js arquivo.pdf
```

### 📁 Exemplos

```bash
# Converter PDF da pasta storage
node hybrid-converter.js storage/documento.pdf

# Resultado: output/documento-openai.md (com IA)
# Resultado: output/documento-basic.md (sem IA)
```

### 💰 Comparação de Métodos

| Método | Qualidade | Velocidade | Custo | Estrutura | Recomendação |
|--------|-----------|------------|-------|-----------|--------------|
| **Claude Web** | 🏆 10/10 | ⏱️ Manual | 🆓 Grátis | ✅ Completa + Tabelas | 📋 Docs técnicos |
| **Claude API** | ⭐ 8/10 | ⚡ 30-60s | 💰 ~$0.008 | ✅ Boa estrutura | 🤖 Automação |
| **OpenAI GPT-4o** | ⭐ 8/10 | ⚡ 20-50s | 💰 ~$0.015 | ✅ Sumário + Links | 🔄 Híbrido |
| **Basic PyMuPDF** | 📊 4/10 | ⚡ 1-3s | 🆓 Grátis | ⚠️ Texto simples | 🔧 Testes rápidos |

## 📁 Estrutura do Projeto

```
PdfMarkdown/
├── output/                 # 📁 Arquivos convertidos (.md)
│   └── .gitkeep
├── storage/                # 📁 PDFs para conversão
│   └── .gitkeep
├── hybrid-converter.js     # 🔧 Conversor principal (IA)
├── test-converter.js       # ⚡ Conversor básico (gratuito)
├── setup-openai.sh         # 🤖 Setup automático OpenAI
├── setup-claude.sh         # 🧠 Setup automático Claude
├── .env.example           # ⚙️ Configurações de exemplo
├── package.json           # 📦 Dependências Node.js
└── README.md              # 📖 Documentação
```

## 💡 Funcionalidades

### Formatação Automática

- **Títulos**: Detecta e converte para `## Título`
- **Parágrafos**: Limpa espaçamentos extras
- **Páginas**: Separa com `---`
- **Encoding**: UTF-8 para caracteres especiais

### Preview Automático

O script mostra automaticamente uma prévia dos primeiros 500 caracteres do arquivo convertido.

## 🔒 Arquivos Não Incluídos no GitHub

Por segurança e tamanho, os seguintes arquivos **NÃO** são enviados para o repositório:

### ❌ Não Incluídos:
- **`.env`** - Suas chaves API privadas
- **`output/*.md`** - Arquivos convertidos (resultados)
- **`storage/*.pdf`** - Seus PDFs originais (podem ser grandes)
- **`node_modules/`** - Dependências (instaladas com `npm install`)

### ✅ Incluídos:
- **`.env.example`** - Modelo de configuração
- **`output/.gitkeep`** - Mantém pasta vazia
- **`storage/.gitkeep`** - Mantém pasta vazia  
- **Scripts e documentação**

> 💡 **Dica**: Após clonar, execute `cp .env.example .env` e configure suas chaves!

## 🔧 Configuração Avançada

### Melhorar Detecção de Títulos

Edite as linhas 38-42 no `test-converter.js` para ajustar critérios de detecção:

```python
# Detecta títulos (linhas em maiúscula ou curtas)
if len(line) < 80 and (line.isupper() or len(line.split()) <= 8):
```

## 🆚 Vantagens vs Serviços Pagos

| Característica | Este Projeto | Blazedocs | Outros Pagos |
|----------------|--------------|-----------|--------------|
| **Custo** | ✅ Gratuito | ❌ Pago | ❌ Pago |
| **Privacidade** | ✅ Local | ❌ Cloud | ❌ Cloud |
| **Limite** | ✅ Ilimitado | ❌ 3/mês | ❌ Limitado |
| **Velocidade** | ✅ Rápido | ⚡ Rápido | ⚡ Rápido |
| **Qualidade** | ✅ Boa | ✅ Excelente | ✅ Boa |

## 🐛 Solução de Problemas

### Erro: "Command not found: python3"

```bash
# Instalar Python 3
# macOS: brew install python3
# Linux: sudo apt install python3
# Windows: python.org/downloads
```

### Erro: "ModuleNotFoundError: No module named 'fitz'"

```bash
python3 -m pip install --upgrade pymupdf
```

### Erro: Permission denied

```bash
# macOS/Linux
sudo python3 -m pip install pymupdf

# Ou instalar localmente
python3 -m pip install --user pymupdf
```

### PDF não converte corretamente

- Verifique se o PDF não está protegido por senha
- PDFs escaneados podem ter qualidade menor
- Teste com um PDF diferente

## 🤝 Contribuição

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 TODO

- [ ] Interface web simples
- [ ] Suporte a OCR para PDFs escaneados
- [ ] Detecção melhorada de tabelas
- [ ] Conversão em lote (múltiplos PDFs)
- [ ] GUI desktop com Electron

## 📄 Licença

MIT License - Use livremente para projetos pessoais e comerciais.

## 🙏 Agradecimentos

- **PyMuPDF**: Biblioteca principal para processamento de PDF
- **Comunidade Open Source**: Por tornar ferramentas gratuitas possíveis

---

⭐ **Deixe uma estrela se este projeto foi útil!**