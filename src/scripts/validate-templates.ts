#!/usr/bin/env node

/**
 * Pre-publish validation script
 * Validates all templates before publishing to NPM
 */

import { TemplateValidator } from '../validators/templateValidator';
import { Logger } from '../utils/logger';

async function main() {
  Logger.bold('\n🔍 Running pre-publish template validation...\n');
  
  try {
    const results = await TemplateValidator.validateAllTemplates();
    TemplateValidator.printAllResults(results);
    
    // Check if all templates are valid
    const allValid = Array.from(results.values()).every(r => r.valid);
    
    if (!allValid) {
      Logger.error('\n❌ Pre-publish validation failed! Fix the errors before publishing.\n');
      process.exit(1);
    }
    
    Logger.success('\n✅ Pre-publish validation passed! Ready to publish.\n');
    process.exit(0);
    
  } catch (error) {
    Logger.error('\n❌ Pre-publish validation encountered an error:\n');
    console.error(error);
    process.exit(1);
  }
}

main();

