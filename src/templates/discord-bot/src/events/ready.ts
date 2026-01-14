import { Events, ActivityType } from 'discord.js';
import type { BotEvent } from '../types';
import { logger } from '../utils/logger';

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    if (!client.user) return;

    logger.ready(client.user.tag);
    logger.info(`Serving ${client.guilds.cache.size} guild(s)`);
    logger.info(`Loaded ${client.commands.size} command(s)`);
    logger.divider();

    // Set bot activity/status
    client.user.setPresence({
      activities: [
        {
          name: '/help for commands',
          type: ActivityType.Listening,
        },
      ],
      status: 'online',
    });

    // Log some statistics
    const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    logger.debug(`Total members across all guilds: ${totalMembers}`);

    // Log guild names in development
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Active guilds:');
      client.guilds.cache.forEach(guild => {
        logger.debug(`  - ${guild.name} (${guild.id})`);
      });
    }
  },
} as BotEvent<Events.ClientReady>;

