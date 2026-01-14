#!/usr/bin/env node

import { createCLI } from './cli';

async function main() {
  const program = await createCLI();
  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

