import { vi } from 'vitest';

/**
 * Mock for child_process.execSync
 */
export function createMockExecSync(successCommands: string[] = []) {
  return vi.fn((command: string, options?: any) => {
    const cmd = command.toString();
    
    // Check if command should succeed
    if (successCommands.some(pattern => cmd.includes(pattern))) {
      return Buffer.from('success');
    }
    
    // Default behaviors for common commands
    if (cmd.includes('--version') || cmd.includes('which') || cmd.includes('where')) {
      return Buffer.from('/usr/bin/command');
    }
    
    if (cmd.includes('git init') || cmd.includes('git add') || cmd.includes('git commit')) {
      return Buffer.from('');
    }
    
    if (cmd.includes('install')) {
      return Buffer.from('');
    }
    
    throw new Error(`Command not found: ${cmd}`);
  });
}

