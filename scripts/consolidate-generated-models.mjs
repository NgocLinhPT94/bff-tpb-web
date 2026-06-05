#!/usr/bin/env node
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const MODELS_DIR = join(__dirname, '../src/infrastructure/strapi/generated/models');
const OUTPUT_DIR = join(__dirname, '../src/infrastructure/strapi/generated');

function getEntityPrefix(filename) {
  const base = basename(filename, '.ts');
  const match = base.match(/^([A-Z][a-z]+)/);
  return match ? match[1] : null;
}

async function main() {
  const files = (await readdir(MODELS_DIR)).filter((f) => f.endsWith('.ts'));

  const groups = new Map();
  for (const file of files) {
    const prefix = getEntityPrefix(file);
    if (!prefix) continue;
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(file);
  }

  console.log(`Found ${groups.size} entity groups`);

  for (const [prefix, groupFiles] of groups) {
    const outputFile = `Strapi${prefix}.ts`;
    const outputPath = join(OUTPUT_DIR, outputFile);
    const groupBasenames = new Set(groupFiles.map((f) => basename(f, '.ts')));

    const allImports = new Set();
    const allContent = [];

    for (const file of groupFiles.sort()) {
      const content = await readFile(join(MODELS_DIR, file), 'utf8');

      // Remove header block (everything before and including the first */)
      const headerEnd = content.indexOf('*/');
      const body = headerEnd >= 0 ? content.slice(headerEnd + 2) : content;

      // Extract all import statements (including multi-line)
      const importRegex = /import\s+(?:type\s+)?\{[\s\S]*?\}\s+from\s+['"]([^'"]+)['"];/g;
      let match;
      const imports = [];
      while ((match = importRegex.exec(body)) !== null) {
        imports.push(match[0]);
      }

      // Remove all import statements from body
      let cleanBody = body;
      for (const imp of imports) {
        cleanBody = cleanBody.replace(imp, '');
      }

      // Clean up multiple blank lines
      cleanBody = cleanBody.replace(/\n{3,}/g, '\n\n');

      // Process imports
      for (const imp of imports) {
        // Skip mapValues (runtime) - we'll add one at top
        if (imp.includes('mapValues')) continue;

        // Fix runtime path
        let fixed = imp.replace("from '../runtime'", "from './runtime'");

        // Skip imports from files in same group
        const importMatch = fixed.match(/from\s+['"]\.\/([^'"]+)['"]/);
        if (importMatch) {
          const importedFile = importMatch[1].replace(/\.ts$/, '');
          if (groupBasenames.has(importedFile)) continue;
        }

        allImports.add(fixed);
      }

      allContent.push(cleanBody.trim());
    }

    const consolidated = `/* tslint:disable */
/* eslint-disable */
/**
 * cms-tpb-web
 * Consolidated models for ${prefix} entity
 *
 * NOTE: Auto-generated. Do not edit manually.
 */

import { mapValues } from './runtime';
${Array.from(allImports).join('\n')}

${allContent.join('\n\n')}`;

    await writeFile(outputPath, consolidated);
    console.log(`✅ ${outputFile} (${groupFiles.length} files)`);
  }

  // Post-processing: fix cross-entity imports
  console.log('\n🔧 Fixing cross-entity imports...');
  const typeToFile = new Map();

  // Build map of all exported types to their consolidated files
  for (const [prefix] of groups) {
    const outputFile = `Strapi${prefix}.ts`;
    const content = await readFile(join(OUTPUT_DIR, outputFile), 'utf8');
    const exportRegex = /export\s+(?:interface|type|const|function)\s+(\w+)/g;
    let match;
    while ((match = exportRegex.exec(content)) !== null) {
      typeToFile.set(match[1], outputFile);
    }
  }

  console.log(`  📊 Built type map with ${typeToFile.size} entries`);

  // Update imports in all consolidated files
  for (const [prefix] of groups) {
    const outputFile = `Strapi${prefix}.ts`;
    const outputPath = join(OUTPUT_DIR, outputFile);
    let content = await readFile(outputPath, 'utf8');

    // Find all imports that reference other entity files
    const importRegex = /from\s+['"](\.\/[^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      const importedFile = basename(importPath, '.ts');
      // Skip runtime
      if (importedFile === 'runtime') continue;
      // Check if this file belongs to another entity
      const otherEntity = typeToFile.get(importedFile);
      if (otherEntity && otherEntity !== outputFile) {
        const newPath = `./${otherEntity.replace('.ts', '')}`;
        // Replace only the exact import path in 'from' statements
        const exactRegex = new RegExp(`from\\s+['"]${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
        content = content.replace(exactRegex, `from '${newPath}'`);
      }
    }

    await writeFile(outputPath, content);
  }

  // Delete the old models directory
  await rm(MODELS_DIR, { recursive: true, force: true });
  console.log(`\n🗑️ Deleted old models/ directory`);

  console.log('\n✅ Consolidation complete!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
