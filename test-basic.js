#!/usr/bin/env node

const { convertPdfToMarkdown } = require('./hybrid-converter.js');
const fs = require('fs');
const path = require('path');

async function runTests() {
    console.log('🧪 Running basic conversion tests...\n');
    
    // Verificar se existe pelo menos um PDF para teste
    const storageDir = './storage';
    if (!fs.existsSync(storageDir)) {
        console.error('❌ Storage directory not found. Please create it and add some PDFs.');
        process.exit(1);
    }
    
    const pdfFiles = fs.readdirSync(storageDir).filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
        console.error('❌ No PDF files found in storage/ directory.');
        console.error('   Please add at least one PDF file to test the converter.');
        process.exit(1);
    }
    
    const testPdf = path.join(storageDir, pdfFiles[0]);
    console.log(`📄 Testing with: ${testPdf}`);
    
    const tests = [
        { method: 'basic', description: 'Basic conversion (no AI)' },
        { method: 'openai', description: 'OpenAI conversion (requires API key)' },
        { method: 'claude', description: 'Claude conversion (requires API key)' }
    ];
    
    for (const test of tests) {
        try {
            console.log(`\n🔄 Testing ${test.description}...`);
            
            // Temporarily set method
            const originalMethod = process.env.AI_METHOD;
            process.env.AI_METHOD = test.method;
            
            const outputPath = path.join('output', `test-${test.method}.md`);
            const startTime = Date.now();
            
            await convertPdfToMarkdown(testPdf, outputPath);
            
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(1);
            const fileSize = fs.statSync(outputPath).size;
            
            console.log(`✅ ${test.description}: ${duration}s, ${fileSize} bytes`);
            
            // Restore original method
            if (originalMethod) {
                process.env.AI_METHOD = originalMethod;
            }
            
        } catch (error) {
            console.log(`⚠️  ${test.description}: ${error.message}`);
            if (test.method !== 'basic') {
                console.log(`   (This is expected if no API key is configured)`);
            }
        }
    }
    
    console.log('\n🎉 Test run completed!');
    console.log('\n💡 Tips:');
    console.log('   - Basic method should always work');
    console.log('   - AI methods require API keys in .env file');
    console.log('   - Check output/ directory for generated files');
}

if (require.main === module) {
    runTests().catch(error => {
        console.error(`❌ Test failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { runTests };