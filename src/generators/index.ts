import { BaseGenerator, GeneratorOptions, TemplateMetadata } from './baseGenerator';

export interface TemplateRegistryEntry {
  metadata: TemplateMetadata;
  GeneratorClass: new (options: GeneratorOptions) => BaseGenerator;
}

class TemplateRegistry {
  private templates: Map<string, TemplateRegistryEntry> = new Map();

  register(entry: TemplateRegistryEntry): void {
    this.templates.set(entry.metadata.id, entry);
  }

  get(templateId: string): TemplateRegistryEntry | undefined {
    return this.templates.get(templateId);
  }

  getAll(): TemplateRegistryEntry[] {
    return Array.from(this.templates.values());
  }

  getAllMetadata(): TemplateMetadata[] {
    return Array.from(this.templates.values()).map(entry => entry.metadata);
  }
}

export const templateRegistry = new TemplateRegistry();

/**
 * Factory function to create a generator instance
 */
export function createGenerator(templateId: string, options: GeneratorOptions): BaseGenerator {
  const entry = templateRegistry.get(templateId);
  
  if (!entry) {
    throw new Error(`Unknown template: ${templateId}`);
  }

  return new entry.GeneratorClass(options);
}

// Export registry for registration by individual generators
export { TemplateRegistry };

