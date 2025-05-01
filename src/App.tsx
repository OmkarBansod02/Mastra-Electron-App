import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import SettingsPanel from './components/SettingsPanel';
import mastraService from './services/mastraService';
import { getConfig, saveConfig, getConfigSync } from './utils/configStore';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // Start with default values and update once async loading completes
  const [settings, setSettings] = useState(getConfigSync());

  useEffect(() => {
    // Load settings asynchronously
    async function loadSettings() {
      try {
        const config = await getConfig();
        setSettings(config);
        
        // Initialize Mastra client after settings are loaded
        await mastraService.initializeClient();
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    // Check connection status on app load or settings change
    async function checkConnection() {
      try {
        const connected = await mastraService.testConnection();
        setIsConnected(connected);
      } catch (error) {
        setIsConnected(false);
      }
    }

    if (settings.mastraCloudUrl && settings.agentId) {
      checkConnection();
    } else {
      setIsConnected(false);
    }
  }, [settings]); // Depend on settings to re-check when they change

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleSettingsSave = async (newSettings: typeof settings) => {
    try {
      await saveConfig(newSettings);
      setSettings(newSettings);
      setShowSettings(false);
      
      // Re-initialize the client with new settings
      await mastraService.initializeClient();
      
      // Check connection status
      const connected = await mastraService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsConnected(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    // We don't need to handle message sending here anymore
    // The ChatInterface component directly interacts with the mastraService
  };

  return (
    <div className="app-container">
      <Header 
        isConnected={isConnected} 
        onSettingsClick={handleSettingsClick} 
      />
      
      <main className="main-content">
        <ChatInterface 
          isConnected={isConnected}
          onSendMessage={handleSendMessage}
          agentId={settings.agentId}
        />
      </main>
      
      {showSettings && (
        <SettingsPanel
          initialSettings={settings}
          onSave={handleSettingsSave}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
};

export default App;
