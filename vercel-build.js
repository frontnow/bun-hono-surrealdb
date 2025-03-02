#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('Running Vercel build script...');

// Install Bun if not already installed
try {
  execSync('bun --version');
  console.log('Bun is already installed.');
} catch (error) {
  console.log('Installing Bun...');
  execSync('curl -fsSL https://bun.sh/install | bash');
  console.log('Bun installed successfully.');
}

// Run the build
console.log('Building the application...');
execSync('bun run build', { stdio: 'inherit' });
console.log('Build completed.');
