/**
 * Analytics Client
 * Privacy-focused analytics tracking for Errika
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import https from 'https';
import { AnalyticsEvent, AnalyticsStorage, UsageStats } from './types';
import { loadConfig } from './consent';

const ANALYTICS_DIR = path.join(os.homedir(), '.errika');
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'analytics.json');

// Simple analytics endpoint (you can replace this with your own backend or Google Analytics)
const ANALYTICS_ENDPOINT = process.env.ERRIKA_ANALYTICS_ENDPOINT || 'https://analytics.errika.dev/event';

/**
 * Load analytics storage
 */
async function loadStorage(): Promise<AnalyticsStorage> {
  try {
    await fs.ensureDir(ANALYTICS_DIR);
    
    if (await fs.pathExists(ANALYTICS_FILE)) {
      return await fs.readJson(ANALYTICS_FILE);
    }
  } catch (error) {
    // Fail silently
  }

  // Default storage
  return {
    config: {
      enabled: false,
      userId: '',
    },
    events: [],
    stats: {
      totalProjects: 0,
      successfulProjects: 0,
      failedProjects: 0,
      templateUsage: {},
    },
  };
}

/**
 * Save analytics storage
 */
async function saveStorage(storage: AnalyticsStorage): Promise<void> {
  try {
    await fs.ensureDir(ANALYTICS_DIR);
    await fs.writeJson(ANALYTICS_FILE, storage, { spaces: 2 });
  } catch (error) {
    // Fail silently
  }
}

/**
 * Send event to analytics backend
 */
async function sendToBackend(event: AnalyticsEvent, userId: string): Promise<void> {
  // Only send if endpoint is configured
  if (!ANALYTICS_ENDPOINT || ANALYTICS_ENDPOINT.includes('example.com')) {
    return;
  }

  try {
    const data = JSON.stringify({
      ...event,
      userId,
      version: '2.0.0', // Add CLI version
    });

    const url = new URL(ANALYTICS_ENDPOINT);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'Errika-CLI/2.0.0',
      },
      timeout: 3000, // 3 second timeout
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        // Consume response to free up memory
        res.on('data', () => {});
        res.on('end', () => resolve());
      });

      req.on('error', () => {
        // Fail silently - analytics should never break the user experience
        resolve();
      });

      req.on('timeout', () => {
        req.destroy();
        resolve();
      });

      req.write(data);
      req.end();
    });
  } catch (error) {
    // Fail silently
  }
}

/**
 * Track a project creation event
 */
export async function trackProjectCreation(
  template: string,
  success: boolean,
  packageManager?: string,
  errorType?: string
): Promise<void> {
  try {
    const config = await loadConfig();
    
    // Don't track if analytics is disabled
    if (!config.enabled) {
      return;
    }

    const event: AnalyticsEvent = {
      eventType: success ? 'project_created' : 'project_failed',
      template,
      success,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      packageManager,
      errorType,
    };

    // Load storage
    const storage = await loadStorage();

    // Add event to storage
    storage.events.push(event);

    // Limit events to last 100
    if (storage.events.length > 100) {
      storage.events = storage.events.slice(-100);
    }

    // Update stats
    storage.stats.totalProjects++;
    if (success) {
      storage.stats.successfulProjects++;
    } else {
      storage.stats.failedProjects++;
    }

    storage.stats.templateUsage[template] = (storage.stats.templateUsage[template] || 0) + 1;
    
    if (!storage.stats.firstUsed) {
      storage.stats.firstUsed = event.timestamp;
    }
    storage.stats.lastUsed = event.timestamp;

    // Save to local storage
    await saveStorage(storage);

    // Send to backend (async, non-blocking)
    sendToBackend(event, config.userId).catch(() => {
      // Fail silently
    });
  } catch (error) {
    // Fail silently - analytics should never break the user experience
  }
}

/**
 * Get usage statistics
 */
export async function getUsageStats(): Promise<UsageStats> {
  try {
    const storage = await loadStorage();
    return storage.stats;
  } catch (error) {
    return {
      totalProjects: 0,
      successfulProjects: 0,
      failedProjects: 0,
      templateUsage: {},
    };
  }
}

/**
 * Get recent events
 */
export async function getRecentEvents(limit = 10): Promise<AnalyticsEvent[]> {
  try {
    const storage = await loadStorage();
    return storage.events.slice(-limit).reverse();
  } catch (error) {
    return [];
  }
}

/**
 * Clear all analytics data
 */
export async function clearAnalyticsData(): Promise<void> {
  try {
    if (await fs.pathExists(ANALYTICS_FILE)) {
      await fs.remove(ANALYTICS_FILE);
    }
  } catch (error) {
    // Fail silently
  }
}

