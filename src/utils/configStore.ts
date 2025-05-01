// Define the configuration schema
export interface ConfigSchema {
  mastraCloudUrl: string;
  agentId: string;
}

// Default configuration with empty values
export const defaultConfig: ConfigSchema = {
  mastraCloudUrl: '',
  agentId: '',
};

// Access to the Electron API from the preload script
declare global {
  interface Window {
    electronAPI: {
      getConfig: () => Promise<ConfigSchema>;
      getConfigSync: () => ConfigSchema;
      saveConfig: (config: ConfigSchema) => Promise<boolean>;
    };
  }
}

// For synchronous access during initial render (with default values)
export function getConfigSync(): ConfigSchema {
  try {
    // Try to get from electron store if available
    if (window.electronAPI && typeof window.electronAPI.getConfigSync === 'function') {
      return window.electronAPI.getConfigSync();
    }
  } catch (error) {
    console.error('Error getting sync config:', error);
  }
  
  return { ...defaultConfig };
}

// Load configuration asynchronously
export async function getConfig(): Promise<ConfigSchema> {
  try {
    if (window.electronAPI && typeof window.electronAPI.getConfig === 'function') {
      const config = await window.electronAPI.getConfig();
      return config as ConfigSchema;
    }
  } catch (error) {
    console.error('Error getting config:', error);
  }
  
  return { ...defaultConfig };
}

// Save configuration
export async function saveConfig(config: ConfigSchema): Promise<void> {
  try {
    if (window.electronAPI && typeof window.electronAPI.saveConfig === 'function') {
      await window.electronAPI.saveConfig(config);
    }
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}
