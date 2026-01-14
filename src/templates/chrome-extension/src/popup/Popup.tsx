import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { getStorageData, setStorageData } from '../utils/storage';
import { sendMessageToBackground, getActiveTab, updateBadge } from '../utils/messaging';
import { MessageType } from '../types';

function Popup() {
  const [count, setCount] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current tab info
      const tab = await getActiveTab();
      if (tab?.url) {
        setCurrentUrl(tab.url);
      }

      // Load saved count from storage
      const data = await getStorageData<{ count?: number }>('count', 'sync');
      if (data.count !== undefined) {
        setCount(data.count);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    try {
      const newCount = count + 1;
      setCount(newCount);
      await setStorageData({ count: newCount }, 'sync');
      
      // Update badge to show count
      await updateBadge(newCount.toString(), '#4285f4');
    } catch (error) {
      console.error('Error incrementing:', error);
    }
  };

  const handleReset = async () => {
    try {
      setCount(0);
      await setStorageData({ count: 0 }, 'sync');
      await updateBadge('', '#4285f4');
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  const handleTestMessage = async () => {
    try {
      const response = await sendMessageToBackground({
        type: MessageType.EXECUTE_ACTION,
        payload: {
          action: 'example-action',
          data: { timestamp: Date.now() }
        }
      });
      
      console.log('Message response:', response);
      alert(response.success ? 'Message sent successfully!' : 'Message failed');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  if (loading) {
    return (
      <div className="popup">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="popup">
      <header className="popup-header">
        <h1>{{projectName}}</h1>
        <p className="subtitle">Chrome Extension</p>
      </header>

      <main className="popup-main">
        <div className="card">
          <h2>Counter Example</h2>
          <div className="counter">
            <span className="count">{count}</span>
          </div>
          <div className="button-group">
            <Button onClick={handleIncrement} variant="primary">
              Increment
            </Button>
            <Button onClick={handleReset} variant="secondary">
              Reset
            </Button>
          </div>
        </div>

        <div className="card">
          <h3>Current Tab</h3>
          <p className="url">{currentUrl || 'No URL available'}</p>
        </div>

        <div className="card">
          <h3>Actions</h3>
          <div className="button-group">
            <Button onClick={handleTestMessage} variant="primary" size="small">
              Test Message
            </Button>
            <Button onClick={openOptions} variant="secondary" size="small">
              Open Options
            </Button>
          </div>
        </div>

        <div className="card">
          <h3>Features</h3>
          <ul>
            <li>✅ Manifest V3</li>
            <li>✅ React 19</li>
            <li>✅ TypeScript</li>
            <li>✅ Chrome Storage API</li>
            <li>✅ Message Passing</li>
            <li>✅ Content Scripts</li>
          </ul>
        </div>
      </main>

      <footer className="popup-footer">
        <p>Built with Errika</p>
      </footer>
    </div>
  );
}

export default Popup;
