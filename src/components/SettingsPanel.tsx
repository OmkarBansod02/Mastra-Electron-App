import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  initialSettings: {
    mastraCloudUrl: string;
    agentId: string;
  };
  onSave: (settings: {
    mastraCloudUrl: string;
    agentId: string;
  }) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  initialSettings,
  onSave,
  onClose
}) => {
  const [mastraCloudUrl, setMastraCloudUrl] = useState(initialSettings.mastraCloudUrl || '');
  const [agentId, setAgentId] = useState(initialSettings.agentId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      mastraCloudUrl,
      agentId,
    });
  };

  return (
    <div className="settings-panel">
      <div className="settings-content">
        <h2 className="settings-title">AI Agent Connection Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="settings-form-group">
            <label 
              htmlFor="mastraCloudUrl" 
              className="settings-label"
            >
              Mastra Cloud URL
            </label>
            <input
              id="mastraCloudUrl"
              type="text"
              value={mastraCloudUrl}
              onChange={(e) => setMastraCloudUrl(e.target.value)}
              className="settings-input"
              placeholder="e.g., https://api.mastra.ai"
            />
            <small className="settings-help-text">The URL of your Mastra Cloud instance where your AI agents are deployed</small>
          </div>

          <div className="settings-form-group">
            <label 
              htmlFor="agentId" 
              className="settings-label"
            >
              Agent ID
            </label>
            <input
              id="agentId"
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="settings-input"
              placeholder="Your Mastra AI Agent ID"
            />
            <small className="settings-help-text">The unique identifier for the AI agent you want to connect to</small>
          </div>

          <div className="settings-buttons">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;
