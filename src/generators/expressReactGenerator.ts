import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';
import { templateRegistry } from './index';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs-extra';

export interface ExpressReactTemplateOptions {
  styling: 'tailwind' | 'styled-components' | 'css-modules';
  includeAuth: boolean;
  includeApi: boolean;
  database: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
}

export class ExpressReactGenerator extends BaseGenerator {
  private templateOptions: ExpressReactTemplateOptions;

  constructor(options: GeneratorOptions) {
    const metadata: TemplateMetadata = {
      id: 'express-react',
      name: 'Express + React Full-Stack',
      description: 'Monorepo with Express.js, React, TypeScript, and Prisma',
      supportedPackageManagers: ['npm', 'yarn', 'pnpm']
    };

    super(options, metadata);
    
    // Extract template-specific options
    this.templateOptions = {
      styling: options.templateVariables?.styling || 'tailwind',
      includeAuth: options.templateVariables?.includeAuth ?? true,
      includeApi: options.templateVariables?.includeApi ?? true,
      database: options.templateVariables?.database || 'postgresql'
    };
  }

  /**
   * Process template files with Express+React-specific logic
   */
  protected async processTemplateFiles(): Promise<void> {
    await this.updatePackageJsonFiles();
    await this.updatePrismaSchema();
    await this.updateEnvFiles();
    await this.updateFrontendStyling();
    await this.removeOptionalFiles();
  }

  /**
   * Update package.json files based on selected options
   */
  private async updatePackageJsonFiles(): Promise<void> {
    // Update backend package.json
    const backendPkgPath = path.join(this.options.targetDirectory, 'backend', 'package.json');
    const backendPkg = await fs.readJson(backendPkgPath);

    if (this.templateOptions.includeAuth) {
      backendPkg.dependencies['jsonwebtoken'] = '^9.0.2';
      backendPkg.dependencies['bcryptjs'] = '^2.4.3';
      backendPkg.devDependencies['@types/jsonwebtoken'] = '^9.0.5';
      backendPkg.devDependencies['@types/bcryptjs'] = '^2.4.6';
    }

    // Database-specific dependencies
    switch (this.templateOptions.database) {
      case 'postgresql':
        backendPkg.dependencies['pg'] = '^8.11.3';
        break;
      case 'mysql':
        backendPkg.dependencies['mysql2'] = '^3.6.5';
        break;
      case 'mongodb':
        backendPkg.dependencies['mongodb'] = '^6.3.0';
        break;
    }

    await fs.writeJson(backendPkgPath, backendPkg, { spaces: 2 });

    // Update frontend package.json
    const frontendPkgPath = path.join(this.options.targetDirectory, 'frontend', 'package.json');
    const frontendPkg = await fs.readJson(frontendPkgPath);

    // Add styling dependencies
    switch (this.templateOptions.styling) {
      case 'tailwind':
        frontendPkg.devDependencies['tailwindcss'] = '^3.4.3';
        frontendPkg.devDependencies['postcss'] = '^8.4.38';
        frontendPkg.devDependencies['autoprefixer'] = '^10.4.19';
        break;
      case 'styled-components':
        frontendPkg.dependencies['styled-components'] = '^6.1.8';
        frontendPkg.devDependencies['@types/styled-components'] = '^5.1.34';
        break;
    }

    if (this.templateOptions.includeAuth) {
      frontendPkg.dependencies['react-router-dom'] = '^6.22.3';
    }

    await fs.writeJson(frontendPkgPath, frontendPkg, { spaces: 2 });
  }

  /**
   * Update Prisma schema based on database choice
   */
  private async updatePrismaSchema(): Promise<void> {
    const schemaPath = path.join(this.options.targetDirectory, 'backend', 'prisma', 'schema.prisma');
    let schema = await fs.readFile(schemaPath, 'utf-8');

    const providerMap: Record<string, string> = {
      postgresql: 'postgresql',
      mysql: 'mysql',
      sqlite: 'sqlite',
      mongodb: 'mongodb'
    };

    schema = schema.replace(
      /provider\s*=\s*"{{DATABASE_PROVIDER}}"/g,
      `provider = "${providerMap[this.templateOptions.database]}"`
    );

    // For MongoDB, adjust the schema
    if (this.templateOptions.database === 'mongodb') {
      schema = schema.replace(/@id @default\(autoincrement\(\)\)/g, '@id @default(auto()) @map("_id") @db.ObjectId');
    }

    await fs.writeFile(schemaPath, schema, 'utf-8');
  }

  /**
   * Update environment files
   */
  private async updateEnvFiles(): Promise<void> {
    const envPath = path.join(this.options.targetDirectory, 'backend', 'env.example');
    let envContent = await fs.readFile(envPath, 'utf-8');

    const databaseUrls: Record<string, string> = {
      postgresql: 'postgresql://user:password@localhost:5432/{{projectName}}',
      mysql: 'mysql://user:password@localhost:3306/{{projectName}}',
      sqlite: 'file:./dev.db',
      mongodb: 'mongodb://localhost:27017/{{projectName}}'
    };

    envContent = envContent.replace(
      /DATABASE_URL=".*"/g,
      `DATABASE_URL="${databaseUrls[this.templateOptions.database]}"`
    );

    await fs.writeFile(envPath, envContent, 'utf-8');
  }

  /**
   * Update frontend styling based on choice
   */
  private async updateFrontendStyling(): Promise<void> {
    const frontendDir = path.join(this.options.targetDirectory, 'frontend');

    // Remove unused styling files
    if (this.templateOptions.styling !== 'tailwind') {
      const tailwindConfig = path.join(frontendDir, 'tailwind.config.js');
      const postcssConfig = path.join(frontendDir, 'postcss.config.js');
      
      if (await fs.pathExists(tailwindConfig)) await fs.remove(tailwindConfig);
      if (await fs.pathExists(postcssConfig)) await fs.remove(postcssConfig);
    }

    if (this.templateOptions.styling !== 'styled-components') {
      // Remove styled-components specific files if any
    }
  }

  /**
   * Remove optional files based on user choices
   */
  private async removeOptionalFiles(): Promise<void> {
    const backendDir = path.join(this.options.targetDirectory, 'backend');
    const frontendDir = path.join(this.options.targetDirectory, 'frontend');

    // Remove auth files if not needed
    if (!this.templateOptions.includeAuth) {
      const authFiles = [
        path.join(backendDir, 'src', 'routes', 'auth.ts'),
        path.join(backendDir, 'src', 'controllers', 'authController.ts'),
        path.join(backendDir, 'src', 'middleware', 'auth.ts'),
        path.join(frontendDir, 'src', 'contexts', 'AuthContext.tsx'),
        path.join(frontendDir, 'src', 'hooks', 'useAuth.ts'),
        path.join(frontendDir, 'src', 'pages', 'Login.tsx'),
        path.join(frontendDir, 'src', 'pages', 'Register.tsx')
      ];

      for (const file of authFiles) {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
        }
      }
    }

    // Remove API example files if not needed
    if (!this.templateOptions.includeApi) {
      const apiFiles = [
        path.join(backendDir, 'src', 'routes', 'items.ts'),
        path.join(backendDir, 'src', 'controllers', 'itemController.ts'),
        path.join(frontendDir, 'src', 'pages', 'Items.tsx')
      ];

      for (const file of apiFiles) {
        if (await fs.pathExists(file)) {
          await fs.remove(file);
        }
      }
    }
  }

  /**
   * Post-generate: Install workspace dependencies and generate Prisma
   */
  protected async postGenerate(): Promise<void> {
    Logger.blueBright('\n🔧 Generating Prisma Client...');
    
    try {
      const { execSync } = require('child_process');
      const backendDir = path.join(this.options.targetDirectory, 'backend');
      
      execSync('npx prisma generate', {
        cwd: backendDir,
        stdio: 'inherit'
      });
      
      Logger.success('Prisma Client generated successfully');
    } catch (error) {
      Logger.warning('Failed to generate Prisma Client. Run "cd backend && npx prisma generate" manually.');
    }
  }

  /**
   * Display Express+React-specific next steps
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
    
    Logger.gray(`  cd backend && cp env.example .env   # Configure backend env`);
    Logger.gray(`  cd backend && npx prisma db push    # Initialize database`);
    Logger.gray(`  ${pmName} run dev                   # Start both servers`);
    
    Logger.newLine();
    Logger.cyan('📚 Your full-stack app includes:');
    Logger.gray('  • Express.js REST API with TypeScript');
    Logger.gray('  • React 18 + Vite frontend');
    Logger.gray('  • Prisma ORM with ' + this.templateOptions.database);
    Logger.gray('  • ' + (this.templateOptions.styling === 'tailwind' ? 'Tailwind CSS' : 
                        this.templateOptions.styling === 'styled-components' ? 'Styled Components' : 
                        'CSS Modules') + ' for styling');
    
    if (this.templateOptions.includeAuth) {
      Logger.gray('  • JWT authentication with protected routes');
    }
    
    if (this.templateOptions.includeApi) {
      Logger.gray('  • Example CRUD API endpoints');
    }
    
    Logger.newLine();
    Logger.gray('🌐 Frontend: http://localhost:5173');
    Logger.gray('🔌 Backend API: http://localhost:3001');
    Logger.gray('📖 Check README.md for detailed documentation');
  }
}

// Register the Express+React generator
templateRegistry.register({
  metadata: {
    id: 'express-react',
    name: 'Express + React',
    description: 'Full-stack monorepo with Express.js backend and React frontend',
    supportedPackageManagers: ['pnpm', 'npm', 'yarn']
  },
  GeneratorClass: ExpressReactGenerator as any
});

