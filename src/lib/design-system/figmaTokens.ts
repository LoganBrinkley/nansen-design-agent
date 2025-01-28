import * as Figma from 'figma-js';
import dotenv from 'dotenv';

dotenv.config();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'eGKEdHWYX8cZg2nhwVTmUP';

const client = Figma.Client({
  personalAccessToken: FIGMA_TOKEN
});

interface DesignToken {
  name: string;
  type: string;
  value: string;
}

interface FigmaStyleNode {
  document: {
    fills?: Array<{
      type: string;
      color: { r: number; g: number; b: number };
      opacity?: number;
    }>;
    style?: {
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: number;
      lineHeightPx?: number;
      lineHeightPercentFontSize?: number;
      letterSpacing?: number;
      textCase?: string;
      textDecoration?: string;
    };
  };
}

interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  textCase?: string;
  textDecoration?: string;
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a) : ''}`;
}

function processTypographyStyle(style: FigmaStyleNode['document']['style']): TypographyStyle | null {
  if (!style || !style.fontFamily || !style.fontSize) {
    return null;
  }

  // Convert line height to a proper CSS value
  let lineHeight: string;
  if (style.lineHeightPx) {
    lineHeight = `${style.lineHeightPx}px`;
  } else if (style.lineHeightPercentFontSize) {
    lineHeight = `${style.lineHeightPercentFontSize / 100}`;
  } else {
    lineHeight = 'normal';
  }

  return {
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontWeight: style.fontWeight || 400,
    lineHeight,
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : 'normal',
    textCase: style.textCase,
    textDecoration: style.textDecoration
  };
}

async function extractStylesFromNode(node: any): Promise<DesignToken[]> {
  const tokens: DesignToken[] = [];

  if (node.type === 'STYLE') {
    let value = '';
    
    if (node.style_type === 'FILL' && node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        value = rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.opacity);
      }
    }

    tokens.push({
      name: node.name,
      type: node.style_type,
      value
    });
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...await extractStylesFromNode(child));
    }
  }

  return tokens;
}

export async function fetchDesignTokens() {
  try {
    const file = await client.file(FILE_KEY);
    const styles = await client.fileStyles(FILE_KEY);
    const nodeIds = styles.data.meta.styles.map(s => s.node_id);
    const styleNodes = await client.fileNodes(FILE_KEY, { ids: nodeIds });

    // Process colors
    const colors = await Promise.all(
      styles.data.meta.styles
        .filter(style => style.style_type === 'FILL')
        .map(async style => {
          const node = styleNodes.data.nodes[style.node_id] as FigmaStyleNode;
          let value = '';
          
          if (node && node.document.fills && node.document.fills.length > 0) {
            const fill = node.document.fills[0];
            if (fill.type === 'SOLID') {
              value = rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.opacity || 1);
            }
          }
          
          return {
            name: style.name,
            type: 'color',
            value
          };
        })
    );

    // Process typography
    const typography = styles.data.meta.styles
      .filter(style => style.style_type === 'TEXT')
      .map(style => {
        const node = styleNodes.data.nodes[style.node_id] as FigmaStyleNode;
        const typographyStyle = node?.document.style ? processTypographyStyle(node.document.style) : null;
        
        return {
          name: style.name,
          type: 'typography',
          value: typographyStyle ? JSON.stringify(typographyStyle) : ''
        };
      });

    // Process spacing and other tokens from the document
    const documentTokens = await extractStylesFromNode(file.data.document);

    return {
      colors,
      typography,
      other: documentTokens
    };
  } catch (error) {
    console.error('Error fetching design tokens:', error);
    throw error;
  }
}

// Function to generate Tailwind config from tokens
export function generateTailwindConfig(tokens: any) {
  return {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: tokens.colors.reduce((acc: any, token: DesignToken) => {
          if (token.value) {
            acc[token.name.toLowerCase().replace(/\s+/g, '-')] = token.value;
          }
          return acc;
        }, {}),
        typography: tokens.typography.reduce((acc: any, token: DesignToken) => {
          if (token.value) {
            try {
              const style = JSON.parse(token.value) as TypographyStyle;
              acc[token.name.toLowerCase().replace(/\s+/g, '-')] = {
                fontFamily: `'${style.fontFamily}'`,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
                ...(style.textCase && { textTransform: style.textCase.toLowerCase() }),
                ...(style.textDecoration && { textDecoration: style.textDecoration.toLowerCase() })
              };
            } catch (e) {
              console.warn(`Could not parse typography value for ${token.name}: ${e}`);
            }
          }
          return acc;
        }, {})
      }
    },
    plugins: []
  };
} 