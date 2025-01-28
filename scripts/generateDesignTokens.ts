import { fetchDesignTokens, generateTailwindConfig } from '../src/lib/design-system/figmaTokens';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    console.log('Fetching design tokens from Figma...');
    const tokens = await fetchDesignTokens();
    
    console.log('Generating Tailwind configuration...');
    const tailwindConfig = generateTailwindConfig(tokens);
    
    // Save the raw tokens
    await fs.writeFile(
      path.join(process.cwd(), 'src/lib/design-system/tokens.json'),
      JSON.stringify(tokens, null, 2)
    );
    
    // Update tailwind.config.ts
    const configContent = `import type { Config } from 'tailwindcss';

const config: Config = ${JSON.stringify(tailwindConfig, null, 2)};

export default config;`;
    
    await fs.writeFile(
      path.join(process.cwd(), 'tailwind.config.ts'),
      configContent
    );
    
    console.log('Design tokens successfully generated and applied!');
  } catch (error) {
    console.error('Error generating design tokens:', error);
    process.exit(1);
  }
}

main(); 