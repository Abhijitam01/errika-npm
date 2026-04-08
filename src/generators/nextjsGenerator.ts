import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs-extra';

export interface NextjsTemplateOptions {
  database: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  includeAuth: boolean;
  includeCrud: boolean;
}

export class NextjsGenerator extends BaseGenerator {
  private nextjsOptions: NextjsTemplateOptions;

  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'nextjs',
      name: 'Next.js',
      description: 'App Router, Tailwind CSS, TypeScript',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
    };

    super(options, metadata);
    
    // Extract Next.js specific options from templateVariables
    this.nextjsOptions = {
      database: options.templateVariables?.database || 'postgresql',
      includeAuth: options.templateVariables?.includeAuth ?? true,
      includeCrud: options.templateVariables?.includeCrud ?? true
    };
  }

  /**
   * Process template files with Next.js-specific logic
   */
  protected async processTemplateFiles(): Promise<void> {
    await this.updatePackageJson();
    await this.updatePrismaSchema();
    await this.updateEnvExample();
    await this.removeOptionalFiles();
  }

  /**
   * Update package.json based on selected options
   */
  private async updatePackageJson(): Promise<void> {
    const packageJsonPath = path.join(this.options.targetDirectory, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    // Add conditional dependencies
    if (this.nextjsOptions.includeAuth) {
      packageJson.dependencies['next-auth'] = '^4.24.5';
      packageJson.dependencies['@auth/prisma-adapter'] = '^1.0.12';
    }

    // Database-specific dependencies
    switch (this.nextjsOptions.database) {
      case 'postgresql':
        packageJson.dependencies['pg'] = '^8.11.3';
        break;
      case 'mysql':
        packageJson.dependencies['mysql2'] = '^3.6.5';
        break;
      case 'mongodb':
        packageJson.dependencies['mongodb'] = '^6.3.0';
        break;
      // SQLite doesn't need additional driver
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  /**
   * Update Prisma schema based on database choice
   */
  private async updatePrismaSchema(): Promise<void> {
    const schemaPath = path.join(this.options.targetDirectory, 'prisma', 'schema.prisma');
    let schema = await fs.readFile(schemaPath, 'utf-8');

    // Replace database provider placeholder
    const providerMap: Record<string, string> = {
      postgresql: 'postgresql',
      mysql: 'mysql',
      sqlite: 'sqlite',
      mongodb: 'mongodb'
    };

    schema = schema.replace(
      /provider\s*=\s*"{{DATABASE_PROVIDER}}"/g,
      `provider = "${providerMap[this.nextjsOptions.database]}"`
    );

    // For MongoDB, adjust the schema
    if (this.nextjsOptions.database === 'mongodb') {
      schema = schema.replace(/@id @default\(autoincrement\(\)\)/g, '@id @default(auto()) @map("_id") @db.ObjectId');
      schema = schema.replace(/@default\(now\(\)\)/g, '@default(now())');
    }

    await fs.writeFile(schemaPath, schema, 'utf-8');
  }

  /**
   * Update .env.example with appropriate database URL
   */
  private async updateEnvExample(): Promise<void> {
    const envPath = path.join(this.options.targetDirectory, '.env.example');
    let envContent = await fs.readFile(envPath, 'utf-8');

    const databaseUrls: Record<string, string> = {
      postgresql: 'postgresql://user:password@localhost:5432/{{projectName}}?schema=public',
      mysql: 'mysql://user:password@localhost:3306/{{projectName}}',
      sqlite: 'file:./dev.db',
      mongodb: 'mongodb://localhost:27017/{{projectName}}'
    };

    envContent = envContent.replace(
      /DATABASE_URL=".*"/g,
      `DATABASE_URL="${databaseUrls[this.nextjsOptions.database]}"`
    );

    await fs.writeFile(envPath, envContent, 'utf-8');
  }

  /**
   * Remove optional files based on user choices
   */
  private async removeOptionalFiles(): Promise<void> {
    // Remove auth files if not needed
    if (!this.nextjsOptions.includeAuth) {
      const authFiles = [
        path.join(this.options.targetDirectory, 'app', 'api', 'auth'),
        path.join(this.options.targetDirectory, 'lib', 'auth.ts'),
        path.join(this.options.targetDirectory, 'middleware.ts')
      ];

      for (const file of authFiles) {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
        }
      }
    }

    // Remove CRUD files if not needed
    if (!this.nextjsOptions.includeCrud) {
      const crudFiles = [
        path.join(this.options.targetDirectory, 'app', 'api', 'items'),
        path.join(this.options.targetDirectory, 'app', 'items')
      ];

      for (const file of crudFiles) {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
        }
      }
    }
  }

  /**
   * Post-generate: Run Prisma generate
   */
  protected async postGenerate(): Promise<void> {
    Logger.blueBright('\n🔧 Generating Prisma Client...');
    
    try {
      const { execSync } = require('child_process');
      execSync('npx prisma generate', {
        cwd: this.options.targetDirectory,
        stdio: 'inherit'
      });
      Logger.success('Prisma Client generated successfully');
    } catch (error) {
      Logger.warning('Failed to generate Prisma Client. Run "npx prisma generate" manually.');
    }
  }

  /**
   * Display Next.js-specific next steps
   */
  protected displayNextSteps(): void {
    const { projectName, packageManager } = this.options;
    const isCurrentDir = projectName === '.' || projectName === './';
    const pmName = packageManager;

    Logger.newLine();
    Logger.gray('Next steps:');
    Logger.gray(`  cd ${isCurrentDir ? '.' : projectName}`);
    
    if (!this.options.installDependencies) {
      Logger.gray(`  ${pmName} install`);
    }
    
    Logger.gray(`  cp .env.example .env     # Configure your environment variables`);
    Logger.gray(`  npx prisma db push       # Initialize database`);
    Logger.gray(`  ${pmName} run dev        # Start development server`);
    
    Logger.newLine();
    Logger.cyan('📚 Your Next.js app includes:');
    Logger.gray('  • Next.js 14 with App Router');
    Logger.gray('  • React 18 with Server Components');
    Logger.gray('  • Tailwind CSS with custom theme');
    Logger.gray('  • TypeScript with strict mode');
    Logger.gray('  • Prisma ORM with ' + this.nextjsOptions.database);
    Logger.gray('  • Zod for validation');
    
    if (this.nextjsOptions.includeAuth) {
      Logger.gray('  • NextAuth.js for authentication');
    }
    
    if (this.nextjsOptions.includeCrud) {
      Logger.gray('  • Example CRUD operations');
    }
    
    Logger.newLine();
    Logger.gray('🌐 Open http://localhost:3000 to view your app');
    Logger.gray('📖 Check README.md for detailed documentation');
  }
}

// Register the Next.js generator
templateRegistry.register({
  metadata: {
    id: 'nextjs',
    name: 'Next.js',
    description: 'App Router, Tailwind CSS, TypeScript',
    supportedPackageManagers: ['npm', 'yarn', 'pnpm', 'bun']
  },
  GeneratorClass: NextjsGenerator as any
});

