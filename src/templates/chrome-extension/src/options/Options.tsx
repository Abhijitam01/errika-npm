import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { getSettings, saveSettings, resetSettings, type ExtensionSettings } from '../utils/storage';

function Options() {
  const [settings, setSettings] = useState<ExtensionSettings>({
    enabled: true,
    theme: 'auto',
    notifications: true,
    autoRun: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      try {
        await resetSettings();
        await loadSettings();
        alert('Settings reset successfully');
      } catch (error) {
        console.error('Error resetting settings:', error);
        alert('Failed to reset settings');
      }
    }
  };

  const updateSetting = <K extends keyof ExtensionSettings>(
    key: K,
    value: ExtensionSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="options">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="options">
      <header className="options-header">
        <h1>{{projectName}}</h1>
        <p>Extension Options</p>
      </header>

      <main className="options-main">
        <section className="section">
          <h2>General Settings</h2>
          
          <div className="setting-item">
            <Toggle
              id="enabled"
              label="Enable Extension"
              checked={settings.enabled}
              onChange={(checked) => updateSetting('enabled', checked)}
            />
            <p className="setting-description">
              Turn the extension on or off
            </p>
          </div>

          <div className="setting-item">
            <Toggle
              id="notifications"
              label="Enable Notifications"
              checked={settings.notifications}
              onChange={(checked) => updateSetting('notifications', checked)}
            />
            <p className="setting-description">
              Show desktop notifications
            </p>
          </div>

          <div className="setting-item">
            <Toggle
              id="autoRun"
              label="Auto-run on Startup"
              checked={settings.autoRun}
              onChange={(checked) => updateSetting('autoRun', checked)}
            />
            <p className="setting-description">
              Automatically run when browser starts
            </p>
          </div>
        </section>

        <section className="section">
          <h2>Appearance</h2>
          
          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as ExtensionSettings['theme'])}
              className="select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </section>

        <section className="section">
          <h2>Actions</h2>
          
          {saved && (
            <div className="success-message">
              ✅ Settings saved successfully!
            </div>
          )}
          
          <div className="button-group">
            <Button onClick={handleSave} variant="primary">
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="danger">
              Reset to Defaults
            </Button>
          </div>
        </section>

        <section className="section">
          <h2>About</h2>
          <p>
            This extension was created with Errika, a modern project generator.
          </p>
          <div className="about-info">
            <p><strong>Version:</strong> {chrome.runtime.getManifest().version}</p>
            <p><strong>Manifest Version:</strong> {chrome.runtime.getManifest().manifest_version}</p>
          </div>
          <ul className="feature-list">
            <li>✅ Manifest V3</li>
            <li>✅ React 19</li>
            <li>✅ TypeScript</li>
            <li>✅ Vite build tool</li>
            <li>✅ Chrome Storage API</li>
            <li>✅ Message Passing</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Options;
