#!/usr/bin/env node

require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');

// Configuração - escolha o método
const CONFIG = {
    // Opções: 'ollama', 'claude', 'openai', 'basic'
    method: process.env.AI_METHOD || 'openai',
    
    // APIs (configure suas chaves)
    anthropic_key: process.env.ANTHROPIC_API_KEY || '',
    openai_key: process.env.OPENAI_API_KEY || '',
    
    // OpenAI
    openai_model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    openai_max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
    openai_temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.1,
    
    // Ollama
    ollama_model: 'llama3.1:8b',
    ollama_url: 'http://localhost:11434'
};

function extractTextWithPyMuPDF(pdfPath) {
    return new Promise((resolve, reject) => {
        const pythonScript = `
import fitz
import sys
import json

def extract_pdf_text(pdf_path):
    doc = fitz.open(pdf_path)
    pages = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        if text.strip():
            pages.append({
                'page_num': page_num + 1,
                'text': text.strip()
            })
    
    doc.close()
    return pages

try:
    pages = extract_pdf_text("${pdfPath}")
    print(json.dumps(pages, ensure_ascii=False))
except Exception as e:
    print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)
`;
        
        exec(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`PyMuPDF Error: ${error.message}`));
                return;
            }
            
            try {
                const pages = JSON.parse(stdout);
                resolve(pages);
            } catch (parseError) {
                reject(new Error(`JSON Parse Error: ${parseError.message}`));
            }
        });
    });
}

async function processWithOllama(extractedText) {
    const prompt = `Converta este texto extraído de PDF para Markdown estruturado e bem formatado:

INSTRUÇÕES:
1. Crie uma hierarquia clara com títulos (# ## ###)
2. Extraia e formate tabelas em markdown
3. Adicione um sumário navegável
4. Use blockquotes para citações importantes
5. Mantenha formatação limpa e legível
6. Remova números de página e cabeçalhos repetitivos
7. Preserve dados importantes e estrutura lógica

TEXTO DO PDF:
${extractedText.slice(0, 8000)} ${extractedText.length > 8000 ? '...[truncated]' : ''}

RESPONDA APENAS COM O MARKDOWN FORMATADO:`;

    return new Promise((resolve, reject) => {
        const requestData = {
            model: CONFIG.ollama_model,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.1,
                top_p: 0.9
            }
        };

        const curlCommand = `curl -s -X POST ${CONFIG.ollama_url}/api/generate \\
            -H "Content-Type: application/json" \\
            -d '${JSON.stringify(requestData)}'`;

        exec(curlCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Ollama Error: ${error.message}`));
                return;
            }

            try {
                const response = JSON.parse(stdout);
                resolve(response.response || 'Erro na conversão');
            } catch (parseError) {
                reject(new Error(`Ollama Response Parse Error: ${parseError.message}`));
            }
        });
    });
}

async function processWithClaude(extractedText) {
    if (!CONFIG.anthropic_key) {
        throw new Error('❌ ANTHROPIC_API_KEY não configurada! Configure no arquivo .env');
    }

    try {
        const anthropic = new Anthropic({
            apiKey: CONFIG.anthropic_key,
        });

        const prompt = `Converta este texto de PDF para Markdown bem estruturado:

${extractedText.slice(0, 100000)}

Instruções:
1. Crie hierarquia clara (# ## ###)
2. Adicione sumário com links
3. Formate tabelas corretamente
4. Use blockquotes para citações
5. Remova elementos desnecessários
6. Mantenha estrutura lógica`;

        const response = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 4000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        return response.content[0].text;
    } catch (error) {
        if (error.status === 401) {
            throw new Error('❌ Claude API key inválida. Verifique ANTHROPIC_API_KEY no .env');
        }
        if (error.status === 429) {
            throw new Error('❌ Limite de API atingido. Tente novamente em alguns minutos.');
        }
        throw new Error(`❌ Claude API Error: ${error.message}`);
    }
}

async function processWithOpenAI(extractedText) {
    if (!CONFIG.openai_key) {
        throw new Error('❌ OPENAI_API_KEY não configurada! Configure no arquivo .env');
    }

    try {
        // Limitar texto para evitar limite de tokens
        const maxTextLength = 30000;
        const textToProcess = extractedText.length > maxTextLength 
            ? extractedText.slice(0, maxTextLength) + '\n\n[...texto truncado...]'
            : extractedText;

        const prompt = `Converta este texto extraído de PDF para Markdown estruturado e profissional:

TEXTO DO PDF:
${textToProcess}

INSTRUÇÕES DETALHADAS:
1. Crie uma hierarquia clara com títulos (# ## ###)
2. Adicione um sumário navegável com links internos
3. Extraia e formate tabelas em markdown correto
4. Use blockquotes (>) para citações importantes
5. Mantenha formatação limpa e legível
6. Remova números de página, cabeçalhos e rodapés repetitivos
7. Preserve todos os dados importantes e estrutura lógica
8. Use listas numeradas e bullet points quando apropriado

RESPONDA APENAS COM O MARKDOWN FORMATADO SEM EXPLICAÇÕES ADICIONAIS:`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: CONFIG.openai_model,
            messages: [
                {
                    role: "system", 
                    content: "Você é um especialista em conversão de documentos PDF para Markdown estruturado. Sempre responda apenas com o markdown formatado, sem explicações adicionais."
                },
                {
                    role: "user", 
                    content: prompt
                }
            ],
            max_tokens: CONFIG.openai_max_tokens,
            temperature: CONFIG.openai_temperature
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.openai_key}`
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('❌ OpenAI API key inválida. Verifique OPENAI_API_KEY no .env');
        }
        if (error.response?.status === 429) {
            throw new Error('❌ Limite de API atingido. Verifique seu plano OpenAI.');
        }
        if (error.response?.data?.error) {
            throw new Error(`❌ OpenAI Error: ${error.response.data.error.message}`);
        }
        throw new Error(`❌ OpenAI API Error: ${error.message}`);
    }
}

function processBasic(pages) {
    // Versão básica sem IA (nossa implementação atual)
    let markdown = '';
    
    pages.forEach((page, index) => {
        if (index > 0) markdown += '\n\n---\n\n';
        
        const lines = page.text.split('\n');
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // Detectar títulos
            if (line.length < 80 && (line === line.toUpperCase() || line.split(' ').length <= 8)) {
                if (!line.match(/^\d+$/)) {
                    markdown += `## ${line}\n\n`;
                    return;
                }
            }
            
            markdown += `${line}\n\n`;
        });
    });
    
    return markdown;
}

async function convertPdfToMarkdown(pdfPath, outputPath) {
    console.log(`🔄 Converting: ${pdfPath}`);
    console.log(`📋 Method: ${CONFIG.method.toUpperCase()}`);
    
    // Criar diretório de output se não existir
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    try {
        // 1. Extrair texto com PyMuPDF
        console.log('📖 Extracting text with PyMuPDF...');
        const pages = await extractTextWithPyMuPDF(pdfPath);
        const fullText = pages.map(p => p.text).join('\n\n');
        
        let finalMarkdown;
        
        // 2. Processar com método escolhido
        switch (CONFIG.method) {
            case 'ollama':
                console.log('🤖 Processing with Ollama...');
                finalMarkdown = await processWithOllama(fullText);
                break;
                
            case 'claude':
                console.log('🧠 Processing with Claude...');
                finalMarkdown = await processWithClaude(fullText);
                break;
                
            case 'openai':
                console.log('🔮 Processing with OpenAI...');
                finalMarkdown = await processWithOpenAI(fullText);
                break;
                
            case 'basic':
            default:
                console.log('⚡ Processing with basic method...');
                finalMarkdown = processBasic(pages);
                break;
        }
        
        // 3. Salvar resultado
        fs.writeFileSync(outputPath, finalMarkdown, 'utf8');
        
        return finalMarkdown;
        
    } catch (error) {
        throw new Error(`Conversion failed: ${error.message}`);
    }
}

function validateEnvironment() {
    const errors = [];
    
    // Verificar se Python está disponível
    try {
        require('child_process').execSync('python3 --version', { stdio: 'pipe' });
    } catch (error) {
        errors.push('❌ Python 3 não encontrado. Instale: https://python.org/downloads');
    }
    
    // Verificar se PyMuPDF está instalado
    try {
        require('child_process').execSync('python3 -c "import fitz"', { stdio: 'pipe' });
    } catch (error) {
        errors.push('❌ PyMuPDF não instalado. Execute: python3 -m pip install pymupdf');
    }
    
    // Verificar configuração de API conforme método
    if (CONFIG.method === 'openai' && !CONFIG.openai_key) {
        errors.push('❌ OpenAI API key não configurada. Configure OPENAI_API_KEY no .env');
    }
    
    if (CONFIG.method === 'claude' && !CONFIG.anthropic_key) {
        errors.push('❌ Claude API key não configurada. Configure ANTHROPIC_API_KEY no .env');
    }
    
    return errors;
}

async function main() {
    const pdfPath = process.argv[2];
    
    if (!pdfPath) {
        console.error('❌ Usage: node hybrid-converter.js <pdf-path> [method]');
        console.error('Methods: basic, ollama, claude, openai');
        console.error('Example: AI_METHOD=ollama node hybrid-converter.js document.pdf');
        process.exit(1);
    }
    
    if (!fs.existsSync(pdfPath)) {
        console.error(`❌ File not found: ${pdfPath}`);
        process.exit(1);
    }
    
    // Validar extensão do arquivo
    if (!pdfPath.toLowerCase().endsWith('.pdf')) {
        console.error('❌ File must be a PDF (.pdf extension)');
        process.exit(1);
    }
    
    // Verificar tamanho do arquivo (limite de 50MB)
    const stats = fs.statSync(pdfPath);
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB > 50) {
        console.error(`❌ File too large: ${fileSizeMB.toFixed(1)}MB (max: 50MB)`);
        process.exit(1);
    }
    
    // Sobrescrever método via argumento
    if (process.argv[3]) {
        const method = process.argv[3].toLowerCase();
        const validMethods = ['basic', 'ollama', 'claude', 'openai'];
        if (!validMethods.includes(method)) {
            console.error(`❌ Invalid method: ${method}`);
            console.error(`Valid methods: ${validMethods.join(', ')}`);
            process.exit(1);
        }
        CONFIG.method = method;
    }
    
    // Validar ambiente
    const envErrors = validateEnvironment();
    if (envErrors.length > 0) {
        console.error('❌ Environment validation failed:');
        envErrors.forEach(error => console.error(`  ${error}`));
        
        if (CONFIG.method !== 'basic') {
            console.error('\n💡 Try using basic method: node hybrid-converter.js file.pdf basic');
        }
        process.exit(1);
    }
    
    const pdfName = path.basename(pdfPath, '.pdf');
    const outputPath = path.join('output', `${pdfName}-${CONFIG.method}.md`);
    
    const startTime = Date.now();
    
    try {
        const result = await convertPdfToMarkdown(pdfPath, outputPath);
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        
        console.log(`✅ Conversion completed in ${duration}s`);
        console.log(`📄 Output: ${outputPath}`);
        
        // Preview
        console.log('\n--- Preview ---');
        console.log(result.substring(0, 500) + (result.length > 500 ? '...' : ''));
        console.log('--- End Preview ---\n');
        
    } catch (error) {
        console.error(`\n❌ Conversion failed: ${error.message}`);
        
        // Sugestões baseadas no tipo de erro
        if (error.message.includes('API key')) {
            console.error('\n💡 Solutions:');
            console.error('  1. Check your .env file has correct API keys');
            console.error('  2. Copy from .env.example: cp .env.example .env');
            console.error('  3. Try basic method: node hybrid-converter.js file.pdf basic');
        }
        
        if (error.message.includes('PyMuPDF') || error.message.includes('fitz')) {
            console.error('\n💡 Install PyMuPDF:');
            console.error('  python3 -m pip install pymupdf');
            console.error('  # or: pip3 install pymupdf');
        }
        
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { convertPdfToMarkdown, CONFIG };