# Mastra Desktop App

## Overview
The Mastra Desktop App is an Electron-based application that provides a desktop interface for interacting with the Mastra AI Agent. It allows you to connect to your Mastra agent and have conversations right from your desktop.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- A valid Mastra Cloud URL and Agent ID

## Getting Started

```bash
# Clone the repository
git clone https://github.com/OmkarBansod02/Mastra-Electron-App.git

# Navigate to project directory
cd Mastra-Electron-App

# Install dependencies
npm install

# Run the application
npm run dev
```

## Configuration
You'll need to configure your Mastra Cloud URL and Agent ID in the app settings when you first launch it.

## Troubleshooting

### Connection Issues
If you're having trouble connecting to your Mastra agent:
1. Check that your Mastra Cloud URL is correct and includes the protocol (e.g., https://)
2. Verify your Agent ID is correct
3. Ensure your network allows connections to the Mastra Cloud URL

### Build Issues
If you encounter build issues:
1. Make sure all dependencies are correctly installed with `npm install`
2. Clear your build directory with `rm -rf dist/` (Linux/Mac) or `rmdir /s /q dist` (Windows)
3. Try rebuilding with `npm run build`

## Dependencies
- Electron: Desktop application framework
- React: UI library
- TypeScript: Typed JavaScript
- @mastra/client-js: Client library for Mastra AI


## License
ISC
