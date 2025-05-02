# Mastra Personal Assistant Desktop App

## Overview
The Mastra Personal Assistant Desktop App is an Electron-based application that provides a desktop interface for interacting with the Mastra AI assistant. It allows you to connect to your Mastra agent and have conversations right from your desktop.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- A valid Mastra Cloud URL and Agent ID

## Installation

### 1. Clone the Repository
First, clone this repository to your local machine.

### 2. Install Dependencies
Navigate to the project directory and install dependencies:

```bash
cd Mastra-Electron-App
npm install
```

## Configuration
Before running the application, you need to configure your Mastra Cloud URL and Agent ID. When you first run the application, you can input these settings through the UI.

Alternatively, the application stores configuration in an Electron Store, which persists these values between sessions.

Required configuration:
- **Mastra Cloud URL**: The URL of your Mastra Cloud instance
- **Agent ID**: The ID of your specific Mastra agent

## Development Workflow

### Start Development Mode
To run the application in development mode:

```bash
npm run dev
```

This command will:
1. Build the application using webpack
2. Start the Electron application

### Watch Mode
If you want to automatically rebuild the application when source files change:

```bash
npm run watch
```

Then in another terminal, start the Electron app:

```bash
electron .
```

## Building for Production

### Build the Application
To build the application without starting it:

```bash
npm run build
```

This will compile TypeScript and pack everything using webpack into the `dist` directory.

### Start the Built Application
To build and then start the application:

```bash
npm start
```

### Package the Application
To create distributable packages for Windows:

```bash
npm run package
```

This will create installation packages in the `dist` directory that can be distributed to users.

## Project Structure
- `src/` - React application source code
- `electron/` - Electron main process code
- `assets/` - Static assets
- `dist/` - Build output directory
- `public/` - Public assets and HTML template

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
