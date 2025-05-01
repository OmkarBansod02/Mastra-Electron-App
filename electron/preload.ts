import { contextBridge, ipcRenderer } from 'electron';

// Define the configuration schema
interface ConfigSchema {
  mastraCloudUrl: string;
  agentId: string;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    // Configuration access functions
    getConfig: async (): Promise<ConfigSchema> => {
      return await ipcRenderer.invoke('get-config');
    },
    getConfigSync: (): ConfigSchema => {
      return ipcRenderer.sendSync('get-config-sync');
    },
    saveConfig: async (config: ConfigSchema): Promise<boolean> => {
      return await ipcRenderer.invoke('save-config', config);
    }
  }
);
