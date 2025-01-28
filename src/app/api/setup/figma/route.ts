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
    const envContent = `FIGMA_ACCESS_TOKEN=${figmaToken}\nFIGMA_FILE_KEY=${fileKey}\n`;

    await fs.writeFile(envPath, envContent, { flag: 'a' });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up Figma:', error);
    return NextResponse.json(
      { error: 'Failed to validate Figma credentials' },
      { status: 400 }
    );
  }
} 