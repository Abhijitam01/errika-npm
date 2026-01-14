import { Events, TextChannel } from 'discord.js';
import type { BotEvent } from '../types';
import { logger } from '../utils/logger';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  name: Events.GuildMemberAdd,

  async execute(client, member) {
    logger.event('Member Joined', `${member.user.tag} joined ${member.guild.name}`);

    // Create welcome embed
    const welcomeEmbed = createEmbed({
      title: '👋 Welcome!',
      description: `Welcome to **${member.guild.name}**, ${member}!`,
      color: Colors.Success,
    })
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Member Count', value: `You're member #${member.guild.memberCount}`, inline: true }
      )
      .setFooter({ text: `User ID: ${member.id}` });

    // Try to send welcome message to system channel
    const systemChannel = member.guild.systemChannel;
    if (systemChannel && systemChannel.isTextBased()) {
      try {
        await systemChannel.send({ embeds: [welcomeEmbed] });
      } catch (error) {
        logger.error('Failed to send welcome message:', error as Error);
      }
    }

    // Alternatively, you can set a specific welcome channel
    // Uncomment and modify the following code to use a specific channel:
    
    /*
    const welcomeChannelId = 'YOUR_CHANNEL_ID_HERE'; // Replace with your channel ID
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId) as TextChannel;
    
    if (welcomeChannel && welcomeChannel.isTextBased()) {
      try {
        await welcomeChannel.send({ embeds: [welcomeEmbed] });
      } catch (error) {
        logger.error('Failed to send welcome message:', error as Error);
      }
    }
    */

    // Optional: Auto-role assignment
    // Uncomment and modify the following code to auto-assign a role:
    
    /*
    const autoRoleId = 'YOUR_ROLE_ID_HERE'; // Replace with your role ID
    const autoRole = member.guild.roles.cache.get(autoRoleId);
    
    if (autoRole) {
      try {
        await member.roles.add(autoRole);
        logger.success(`Assigned ${autoRole.name} role to ${member.user.tag}`);
      } catch (error) {
        logger.error('Failed to assign auto-role:', error as Error);
      }
    }
    */

    // Optional: Send welcome DM
    // Uncomment to enable welcome DMs:
    
    /*
    try {
      await member.send({
        embeds: [
          createEmbed({
            title: `Welcome to ${member.guild.name}!`,
            description: 'Thanks for joining! Here are some things to get you started:\n\n' +
              '• Read the rules in the rules channel\n' +
              '• Introduce yourself in the introductions channel\n' +
              '• Use `/help` to see available commands',
            color: Colors.Primary,
          }),
        ],
      });
    } catch (error) {
      // User has DMs disabled
    }
    */
  },
} as BotEvent<Events.GuildMemberAdd>;

