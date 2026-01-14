#!/usr/bin/env node
"use strict";
/**
 * Pre-publish validation script
 * Validates all templates before publishing to NPM
 */
Object.defineProperty(exports, "__esModule", { value: true });
const templateValidator_1 = require("../src/validators/templateValidator");
const logger_1 = require("../src/utils/logger");
async function main() {
    logger_1.Logger.bold('\n🔍 Running pre-publish template validation...\n');
    try {
        const results = await templateValidator_1.TemplateValidator.validateAllTemplates();
        templateValidator_1.TemplateValidator.printAllResults(results);
        // Check if all templates are valid
        const allValid = Array.from(results.values()).every(r => r.valid);
        if (!allValid) {
            logger_1.Logger.error('\n❌ Pre-publish validation failed! Fix the errors before publishing.\n');
            process.exit(1);
        }
        logger_1.Logger.success('\n✅ Pre-publish validation passed! Ready to publish.\n');
        process.exit(0);
    }
    catch (error) {
        logger_1.Logger.error('\n❌ Pre-publish validation encountered an error:\n');
        console.error(error);
        process.exit(1);
    }
}
main();
