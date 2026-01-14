# Custom Template Examples

This directory contains example custom templates to help you get started with creating your own.

## Examples

### 1. Simple Node App (`custom-template-example/`)

A basic Node.js template demonstrating:
- Custom configuration
- Custom prompts (author name, include tests)
- Post-generation scripts
- Template variables

**Usage:**
```bash
errika add-template examples/custom-template-example
errika create my-node-app
# Select "simple-node-app" from the list
```

### 2. Next.js Portfolio (`inherited-template-example/`)

A Next.js portfolio template demonstrating:
- Template inheritance (extends built-in `nextjs` template)
- Custom prompts for personalization
- Selective file override
- Theme customization

**Usage:**
```bash
errika add-template examples/inherited-template-example
errika create my-portfolio
# Select "nextjs-portfolio" from the list
```

## Creating Your Own Template

See [CUSTOM_TEMPLATES.md](../CUSTOM_TEMPLATES.md) for detailed documentation on creating custom templates.

### Quick Steps

1. Create a directory with your template files
2. Add `template.config.json` with configuration
3. Use `{{variableName}}` placeholders in files
4. Add custom prompts if needed
5. Install with `errika add-template ./your-template`

## Template Structure

```
your-template/
├── template.config.json    # Required configuration
├── package.json            # With {{projectName}} placeholders
├── README.md               # Template documentation
├── gitignore              # Renamed to .gitignore
└── src/                   # Your template files
```

## Learn More

- [Custom Templates Guide](../CUSTOM_TEMPLATES.md) - Complete documentation
- [Template Configuration Schema](../CUSTOM_TEMPLATES.md#template-configuration) - Config options
- [Template Inheritance](../CUSTOM_TEMPLATES.md#template-inheritance) - Extending templates
- [Best Practices](../CUSTOM_TEMPLATES.md#best-practices) - Recommendations

