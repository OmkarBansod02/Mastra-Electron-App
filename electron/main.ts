import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import Store from 'electron-store';

// Define the schema for our configuration
interface ConfigSchema {
  mastraCloudUrl: string;
  agentId: string;
}

// Create a store instance with type assertion to handle TypeScript definitions
const configStore = new Store({
  schema: {
    mastraCloudUrl: {
      type: 'string',
      default: 'https://api.mastra.ai'
    },
    agentId: {
      type: 'string',
      default: 'personal-assistant'
    }
  }
}) as any; // Type assertion to bypass TypeScript errors

// Keep a global reference of the window object to avoid
// the window being closed automatically when the JavaScript object is garbage collected
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // For security reasons
      contextIsolation: true, // Protect against prototype pollution
      preload: path.join(__dirname, 'preload.js') // Use a preload script
    }
  });

  // Load the index.html file
  const startUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    // Removed automatic DevTools opening
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On macOS it's common to re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Setup IPC handlers for communication between main and renderer processes
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

// Handle config get requests
ipcMain.handle('get-config', async () => {
  return {
    mastraCloudUrl: configStore.get('mastraCloudUrl'),
    agentId: configStore.get('agentId'),
  };
});

// Sync version for initial render
ipcMain.on('get-config-sync', (event) => {
  const config = {
    mastraCloudUrl: configStore.get('mastraCloudUrl'),
    agentId: configStore.get('agentId')
  };
  event.returnValue = config;
});

// Handle config set requests
ipcMain.handle('save-config', async (_event, config: ConfigSchema) => {
  try {
    configStore.set('mastraCloudUrl', config.mastraCloudUrl);
    configStore.set('agentId', config.agentId);
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
});
