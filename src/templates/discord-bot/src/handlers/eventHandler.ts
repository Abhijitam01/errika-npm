import { readdirSync } from 'fs';
import { join } from 'path';
import type { ExtendedClient } from '../client';
import { logger } from '../utils/logger';

/**
 * Load all events from the events directory
 */
export async function loadEvents(client: ExtendedClient, eventsPath: string): Promise<void> {
  const eventFiles = readdirSync(eventsPath).filter(
    file => file.endsWith('.ts') || file.endsWith('.js')
  );

  logger.info(`Loading ${eventFiles.length} event(s)...`);

  for (const file of eventFiles) {
    try {
      const filePath = join(eventsPath, file);
      const event = await import(filePath);
      const eventData = event.default;

      if ('name' in eventData && 'execute' in eventData) {
        if (eventData.once) {
          client.once(eventData.name, (...args) => eventData.execute(client, ...args));
        } else {
          client.on(eventData.name, (...args) => eventData.execute(client, ...args));
        }

        logger.success(`Loaded event: ${eventData.name}${eventData.once ? ' (once)' : ''}`);
      } else {
        logger.warn(`Event at ${filePath} is missing required "name" or "execute" property.`);
      }
    } catch (error) {
      logger.error(`Failed to load event ${file}:`, error as Error);
    }
  }

  logger.success(`Successfully loaded ${eventFiles.length} event(s)`);
}

