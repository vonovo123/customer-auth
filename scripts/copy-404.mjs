import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));
console.log('Copied dist/index.html -> dist/404.html');
