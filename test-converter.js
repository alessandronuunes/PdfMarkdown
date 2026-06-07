#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function convertPdfToMarkdown(pdfPath, outputPath) {
    return new Promise((resolve, reject) => {
        const pythonScript = `
import fitz
import sys
import re

def clean_text(text):
    # Remove extra whitespace and normalize line breaks
    text = re.sub(r'\\n\\s*\\n', '\\n\\n', text)
    text = re.sub(r'[ \\t]+', ' ', text)
    return text.strip()

def pdf_to_markdown(pdf_path, output_path):
    doc = fitz.open(pdf_path)
    markdown_content = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        if text.strip():
            # Simple markdown formatting
            lines = text.split('\\n')
            formatted_lines = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                    
                # Detect headers (lines that are all caps or short and bold-looking)
                if len(line) < 80 and (line.isupper() or len(line.split()) <= 8):
                    if not any(char.isdigit() for char in line[:10]):
                        formatted_lines.append(f"## {line}")
                        continue
                
                formatted_lines.append(line)
            
            if formatted_lines:
                markdown_content.append("\\n".join(formatted_lines))
    
    doc.close()
    
    # Join all pages and clean up
    full_text = "\\n\\n---\\n\\n".join(markdown_content)
    full_text = clean_text(full_text)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
    
    return True

try:
    result = pdf_to_markdown("${pdfPath}", "${outputPath}")
    print("✅ PDF converted successfully to Markdown!")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
`;
        
        console.log(`Converting: ${pdfPath}`);
        console.log(`Using: PyMuPDF (Free & Fast)`);
        
        exec(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
            }
            
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            
            console.log(`Stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

async function main() {
    const pdfPath = process.argv[2];
    
    if (!pdfPath) {
        console.error('Usage: node test-converter.js <path-to-pdf>');
        process.exit(1);
    }
    
    if (!fs.existsSync(pdfPath)) {
        console.error(`File not found: ${pdfPath}`);
        process.exit(1);
    }
    
    const pdfName = path.basename(pdfPath, '.pdf');
    const outputPath = path.join('output', `${pdfName}.md`);
    
    try {
        await convertPdfToMarkdown(pdfPath, outputPath);
        
        if (fs.existsSync(outputPath)) {
            console.log(`✅ Successfully converted to: ${outputPath}`);
            
            // Show first 500 characters of the result
            const content = fs.readFileSync(outputPath, 'utf8');
            console.log('\n--- Preview of generated markdown ---');
            console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
            console.log('--- End preview ---\n');
        } else {
            console.log('❌ Conversion completed but output file not found');
        }
        
    } catch (error) {
        console.error('❌ Conversion failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}