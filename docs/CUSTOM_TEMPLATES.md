# Custom Templates Guide

Errika supports custom templates, allowing you to create your own project scaffolding or extend existing templates. This guide explains how to create, manage, and share custom templates.

## Table of Contents

- [Quick Start](#quick-start)
- [Template Structure](#template-structure)
- [Template Configuration](#template-configuration)
- [Template Inheritance](#template-inheritance)
- [Custom Prompts](#custom-prompts)
- [Post-Generation Scripts](#post-generation-scripts)
- [Managing Templates](#managing-templates)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Quick Start

### Creating a Simple Custom Template

1. **Create a template directory:**

```bash
mkdir my-custom-template
cd my-custom-template
```

2. **Create template.config.json:**

```json
{
  "name": "my-custom-template",
  "description": "My custom project template",
  "author": "Your Name",
  "version": "1.0.0",
  "supportedPackageManagers": ["npm", "yarn", "pnpm"]
}
```

3. **Add template files:**

```bash
mkdir -p src
echo "console.log('Hello from {{projectName}}');" > src/index.js
```

4. **Create package.json:**

```json
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js"
  }
}
```

5. **Install the template:**

```bash
errika add-template ./my-custom-template
```

6. **Use the template:**

```bash
errika create my-project
# Select "my-custom-template" from the list
```

## Template Structure

A custom template is a directory with the following structure:

```
my-custom-template/
├── template.config.json    # Template configuration (required)
├── README.md                # Template documentation
├── gitignore                # Will be renamed to .gitignore
├── package.json             # Can use {{projectName}} placeholder
└── src/                     # Your template files
    └── index.js
```

### Special Files

- **gitignore** → Renamed to `.gitignore` during generation
- **env.example** → Renamed to `.env.example` during generation
- **npmrc** → Renamed to `.npmrc` during generation

### Placeholders

Use `{{variableName}}` in any file for dynamic replacement:

- `{{projectName}}` - Project name from prompts
- Any custom variable from `templateVariables`

**Example package.json:**

```json
{
  "name": "{{projectName}}",
  "description": "Created with {{templateName}}",
  "author": "{{author}}"
}
```

## Template Configuration

### template.config.json Schema

```typescript
{
  // Required fields
  "name": string,              // Unique template identifier
  "description": string,       // Short description

  // Optional metadata
  "author": string,            // Template author
  "version": string,           // Template version
  
  // Template inheritance
  "extends": string,           // Base template to inherit from
  
  // Package manager support
  "supportedPackageManagers": string[], // ["npm", "yarn", "pnpm", "bun"]
  
  // Custom prompts
  "customPrompts": [
    {
      "name": string,          // Variable name
      "type": "text" | "select" | "confirm",
      "message": string,       // Question to ask
      "choices": string[],     // Options for select type
      "default": any           // Default value
    }
  ],
  
  // Post-generation scripts
  "customScripts": [
    {
      "name": string,          // Script name
      "description": string,   // What the script does
      "command": string,       // Command to run
      "when": "before" | "after" // When to run (default: after)
    }
  ],
  
  // File handling
  "files": {
    "exclude": string[],       // Patterns to exclude
    "override": string[]       // Files that override base template
  }
}
```

### Full Example

```json
{
  "name": "my-fastify-api",
  "description": "Fastify API with TypeScript and Prisma",
  "author": "Your Name",
  "version": "1.0.0",
  "extends": "express-react",
  "supportedPackageManagers": ["npm", "yarn", "pnpm"],
  "customPrompts": [
    {
      "name": "includeSwagger",
      "type": "confirm",
      "message": "Include Swagger documentation?",
      "default": true
    },
    {
      "name": "database",
      "type": "select",
      "message": "Choose a database:",
      "choices": ["PostgreSQL", "MySQL", "MongoDB"],
      "default": "PostgreSQL"
    }
  ],
  "customScripts": [
    {
      "name": "setup",
      "description": "Initialize database",
      "command": "npm run db:init",
      "when": "after"
    }
  ],
  "files": {
    "exclude": ["backend/src/routes/old-*.ts"],
    "override": ["backend/src/index.ts", "README.md"]
  }
}
```

## Template Inheritance

Extend existing templates to avoid duplicating common setup.

### Basic Inheritance

**template.config.json:**

```json
{
  "name": "my-nextjs-blog",
  "description": "Next.js blog template with MDX",
  "extends": "nextjs"
}
```

This template:
1. Copies all files from the `nextjs` template
2. Copies files from `my-nextjs-blog` (overriding base files)
3. Uses both configurations (custom overrides base)

### Selective File Override

Only override specific files:

```json
{
  "name": "my-custom-nextjs",
  "extends": "nextjs",
  "files": {
    "override": [
      "app/page.tsx",
      "tailwind.config.ts",
      "README.md"
    ]
  }
}
```

### Multi-Level Inheritance

```
nextjs (built-in)
  └── my-nextjs-base (custom)
        └── my-nextjs-blog (custom)
```

**my-nextjs-blog/template.config.json:**

```json
{
  "name": "my-nextjs-blog",
  "extends": "my-nextjs-base"
}
```

## Custom Prompts

Add interactive prompts to collect user preferences.

### Text Input

```json
{
  "customPrompts": [
    {
      "name": "apiUrl",
      "type": "text",
      "message": "Enter your API URL:",
      "default": "https://api.example.com"
    }
  ]
}
```

Use in files:

```env
API_URL={{apiUrl}}
```

### Select (Dropdown)

```json
{
  "customPrompts": [
    {
      "name": "styling",
      "type": "select",
      "message": "Choose a styling solution:",
      "choices": ["Tailwind CSS", "Styled Components", "CSS Modules"],
      "default": "Tailwind CSS"
    }
  ]
}
```

### Confirmation

```json
{
  "customPrompts": [
    {
      "name": "includeTests",
      "type": "confirm",
      "message": "Include testing setup?",
      "default": true
    }
  ]
}
```

### Conditional File Inclusion

Use custom prompts to conditionally include files in your generator logic.

## Post-Generation Scripts

Run custom commands after project generation.

### Examples

**Initialize Database:**

```json
{
  "customScripts": [
    {
      "name": "init-db",
      "description": "Initialize database schema",
      "command": "npm run prisma:push",
      "when": "after"
    }
  ]
}
```

**Install Additional Dependencies:**

```json
{
  "customScripts": [
    {
      "name": "install-deps",
      "description": "Install peer dependencies",
      "command": "npm install --save-peer react react-dom",
      "when": "after"
    }
  ]
}
```

**Pre-Generation Setup:**

```json
{
  "customScripts": [
    {
      "name": "validate",
      "description": "Validate environment",
      "command": "./scripts/validate-env.sh",
      "when": "before"
    }
  ]
}
```

## Managing Templates

### Adding a Template

**From local directory:**

```bash
errika add-template ./path/to/template
```

**With custom name:**

```bash
errika add-template ./path/to/template --name my-template
```

### Listing Templates

```bash
errika list-templates
# or
errika ls-templates
```

Output:

```
📦 Custom Templates:

  My Next.js Blog (my-nextjs-blog)
    A blog template with MDX support
    Extends: nextjs
    Author: John Doe

  FastAPI Backend (fastapi-backend)
    FastAPI with PostgreSQL and Docker
    Author: Jane Smith
```

### Removing a Template

```bash
errika remove-template my-template
# or
errika rm-template my-template
```

### Template Location

Custom templates are stored in:

```
~/.errika/templates/
├── my-template-1/
├── my-template-2/
└── my-template-3/
```

## Best Practices

### 1. Template Organization

```
my-template/
├── template.config.json    # Configuration first
├── README.md               # Documentation
├── CHANGELOG.md            # Version history
├── .gitignore             # Template-level ignores
└── [template files]       # Actual template
```

### 2. Clear Naming

- Use descriptive template names
- Follow convention: `category-subcategory-feature`
- Examples: `nextjs-blog-mdx`, `express-api-graphql`

### 3. Documentation

Include a README.md explaining:
- What the template includes
- Prerequisites
- Setup instructions
- Customization options
- Common issues

### 4. Version Your Templates

```json
{
  "name": "my-template",
  "version": "2.1.0",
  "changelog": "Added TypeScript support"
}
```

### 5. Test Your Templates

Before sharing:

```bash
# Add template
errika add-template ./my-template

# Test generation
errika create test-project
# Select your template

# Verify it works
cd test-project
npm install
npm run dev
```

### 6. Use Meaningful Placeholders

```json
{
  "customPrompts": [
    {
      "name": "authorName",
      "type": "text",
      "message": "Author name:",
      "default": "Your Name"
    },
    {
      "name": "authorEmail",
      "type": "text",
      "message": "Author email:",
      "default": "you@example.com"
    }
  ]
}
```

## Examples

### Example 1: Simple Node.js CLI Template

**template.config.json:**

```json
{
  "name": "nodejs-cli",
  "description": "Node.js CLI application template",
  "author": "Your Name",
  "supportedPackageManagers": ["npm", "yarn", "pnpm"],
  "customPrompts": [
    {
      "name": "commandName",
      "type": "text",
      "message": "CLI command name:",
      "default": "mycli"
    }
  ]
}
```

**package.json:**

```json
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "bin": {
    "{{commandName}}": "./bin/cli.js"
  },
  "scripts": {
    "start": "node bin/cli.js"
  }
}
```

### Example 2: Extended Next.js with Auth

**template.config.json:**

```json
{
  "name": "nextjs-auth-app",
  "description": "Next.js with NextAuth and Prisma",
  "extends": "nextjs",
  "customPrompts": [
    {
      "name": "authProvider",
      "type": "select",
      "message": "Choose auth provider:",
      "choices": ["GitHub", "Google", "Email"],
      "default": "GitHub"
    }
  ],
  "customScripts": [
    {
      "name": "setup-auth",
      "description": "Configure authentication",
      "command": "node scripts/setup-auth.js",
      "when": "after"
    }
  ],
  "files": {
    "override": ["app/api/auth/[...nextauth]/route.ts"]
  }
}
```

### Example 3: Microservices Template

**template.config.json:**

```json
{
  "name": "microservices-template",
  "description": "Microservices with Docker and K8s",
  "customPrompts": [
    {
      "name": "services",
      "type": "text",
      "message": "Service names (comma-separated):",
      "default": "api,worker,scheduler"
    },
    {
      "name": "messageQueue",
      "type": "select",
      "message": "Message queue:",
      "choices": ["RabbitMQ", "Redis", "Kafka"],
      "default": "RabbitMQ"
    }
  ],
  "customScripts": [
    {
      "name": "generate-services",
      "description": "Generate service directories",
      "command": "node scripts/generate-services.js",
      "when": "after"
    },
    {
      "name": "init-docker",
      "description": "Initialize Docker Compose",
      "command": "docker-compose up -d",
      "when": "after"
    }
  ]
}
```

## Sharing Templates

### Via Git Repository

```bash
# Clone and install
git clone https://github.com/username/my-template.git
errika add-template ./my-template
```

### Via npm Package

```json
{
  "name": "@username/errika-template-name",
  "version": "1.0.0",
  "files": ["template.config.json", "**/*"]
}
```

```bash
npm install -g @username/errika-template-name
errika add-template $(npm root -g)/@username/errika-template-name
```

### Template Registry (Future)

We're working on a template registry where you can:
- Publish templates
- Browse community templates
- Install with one command

```bash
# Coming soon
errika install-template @community/awesome-template
```

## Troubleshooting

### Template Not Found

```
Error: Template 'my-template' not found
```

**Solution:**
```bash
# List installed templates
errika list-templates

# Add the template
errika add-template ./path/to/template
```

### Base Template Not Found

```
Error: Base template 'nextjs' not found
```

**Solution:**
Ensure the base template exists (either built-in or custom).

### Invalid Configuration

```
Error: Template config must have a valid name
```

**Solution:**
Validate your `template.config.json`:

```bash
# Check JSON syntax
cat template.config.json | json_pp
```

### Script Execution Failed

```
Warning: Custom script 'setup' failed
```

**Solution:**
- Ensure the script exists and is executable
- Check script dependencies are installed
- Use absolute paths or ensure commands are in PATH

## Advanced Topics

### Dynamic File Generation

Create files dynamically based on prompts:

**scripts/generate-files.js:**

```javascript
const fs = require('fs');
const path = require('path');

const services = process.env.SERVICES.split(',');

services.forEach(service => {
  const dir = path.join('services', service);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'index.js'),
    `console.log('${service} service');`
  );
});
```

### Template Validation

Add validation scripts:

```json
{
  "customScripts": [
    {
      "name": "validate",
      "command": "node scripts/validate.js",
      "when": "before"
    }
  ]
}
```

**scripts/validate.js:**

```javascript
// Validate environment requirements
const requiredTools = ['docker', 'kubectl'];

for (const tool of requiredTools) {
  try {
    require('child_process').execSync(`which ${tool}`, { stdio: 'ignore' });
  } catch {
    console.error(`Required tool not found: ${tool}`);
    process.exit(1);
  }
}
```

## Resources

- [Errika Documentation](https://errika.dev/docs)
- [Template Examples Repository](https://github.com/errika/templates)
- [Community Templates](https://errika.dev/templates)

## Contributing

We welcome template contributions! Share your templates:

1. Create a GitHub repository
2. Add `errika-template` topic
3. Submit to community showcase

---

**Questions or issues?**
- GitHub: https://github.com/yourusername/errika
- Discord: https://discord.gg/errika

