import { NextResponse } from 'next/server';
import * as Figma from 'figma-js';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = await fs.readFile(envPath, 'utf-8');
    
    const hasToken = envContent.includes('FIGMA_ACCESS_TOKEN=');
    const hasFileKey = envContent.includes('FIGMA_FILE_KEY=');
    
    return NextResponse.json({ configured: hasToken && hasFileKey });
  } catch (error) {
    return NextResponse.json({ configured: false });
  }
}

export async function POST(req: Request) {
  try {
    const { figmaToken, fileKey } = await req.json();

    // Validate the token by making a test API call
    const client = Figma.Client({ personalAccessToken: figmaToken });
    await client.file(fileKey);

    // If we get here, the credentials are valid
    const envPath = path.join(process.cwd(), '.env.local');
    
    // Read existing .env.local content
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      // File doesn't exist yet, that's okay
    }

    // Keep NODE_ENV if it exists, remove any existing Figma credentials
    const lines = envContent.split('\n').filter(line => 
      line.trim() !== '' && 
      !line.startsWith('FIGMA_ACCESS_TOKEN=') && 
      !line.startsWith('FIGMA_FILE_KEY=')
    );

    // Add new Figma credentials
    lines.push(`FIGMA_ACCESS_TOKEN=${figmaToken}`);
    lines.push(`FIGMA_FILE_KEY=${fileKey}`);

    // Write back to file
    await fs.writeFile(envPath, lines.join('\n') + '\n');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up Figma:', error);
    return NextResponse.json(
      { error: 'Failed to validate Figma credentials' },
      { status: 400 }
    );
  }
} 