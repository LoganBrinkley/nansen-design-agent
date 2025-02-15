# Nansen Design Agent

A specialized Next.js application that serves as an AI-powered design agent for Nansen, helping teams build consistent experiences that align with Nansen's design system. This agent works seamlessly with Cursor IDE to provide real-time design guidance and component generation.

## Quick Start with Cursor Composer

1. Open Cursor IDE
2. Press ⌘K (Mac) or Ctrl+K (Windows) to open the Composer
3. Paste this command:
   ```
   Clone https://github.com/LoganBrinkley/nansen-design-agent.git, install dependencies, and start the development server
   ```
4. After cloning and installation, you'll need to set up your Figma credentials:
   - Copy `.env.example` to `.env.local`
   - Add your Figma access token and file key (see Figma Setup section below)
   - Restart the development server

## Overview

This design agent helps you:
- Generate UI components that follow Nansen's design guidelines
- Maintain consistency across different Nansen applications
- Accelerate development while ensuring design compliance
- Access Nansen's design tokens and components through AI assistance

## Features

- 🎨 Design System Integration
  - Pre-configured with Nansen's design tokens
  - Tailwind CSS setup matching Nansen's color palette
  - Component templates following Nansen's UI patterns

- 🤖 AI-Powered Development (via Cursor)
  - Real-time design suggestions
  - Component generation based on design specifications
  - Code completion with design system awareness
  - Automated style guide compliance

- ⚡️ Modern Tech Stack
  - Next.js 14 with TypeScript
  - Tailwind CSS for styling
  - AI integrations (OpenAI, Anthropic, Replicate)
  - Real-time development server with hot reloading

## Getting Started

### Prerequisites

- [Cursor IDE](https://cursor.sh/) installed
- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LoganBrinkley/nansen-design-agent.git
cd nansen-design-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your credentials:
- Required: Figma credentials (see Figma Setup section below)
- Optional: AI service credentials if using those features

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser and follow the setup process

### Figma Setup

The application requires access to Nansen's Figma design system. You'll need:

1. A Figma Access Token:
   - Log in to Figma
   - Go to Settings → Account → Personal access tokens
   - Create a new access token
   - Copy the token when prompted (you won't be able to see it again)
   - Add it to your `.env.local` as `FIGMA_ACCESS_TOKEN`

2. The Figma File Key:
   - Open Nansen's design system in Figma
   - The file key is in the URL: figma.com/file/FILE_KEY/...
   - Copy the FILE_KEY portion
   - Add it to your `.env.local` as `FIGMA_FILE_KEY`

### Optional Features

The project includes several optional integrations that can be enabled by adding the appropriate API keys to your `.env.local`:

- Firebase Authentication and Storage
- OpenAI for AI assistance
- Anthropic Claude for AI assistance
- Replicate for image generation
- Deepgram for audio transcription

See `.env.example` for all available configuration options.

## Design System Integration

### Available Design Tokens

The agent includes Nansen's design tokens for:
- Colors
- Typography
- Spacing
- Shadows
- Border radius
- Animation timings

### Component Library

Access to pre-built components following Nansen's design system:
- Buttons
- Input fields
- Cards
- Navigation elements
- Typography components
- Layout containers

### Best Practices

1. Always use the design agent through Cursor's Composer for consistent results
2. Reference existing components before creating new ones
3. Use the provided design tokens instead of hard-coded values
4. Follow the component naming conventions for consistency

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Private - All rights reserved

## Support

For support or questions:
1. Open an issue in the GitHub repository
2. Contact the Nansen design team
3. Check the internal documentation for additional guidance