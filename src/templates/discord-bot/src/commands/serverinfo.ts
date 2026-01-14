import { SlashCommandBuilder, ChannelType } from 'discord.js';
import type { Command } from '../types';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information about the server'),

  async execute(client, interaction) {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({
        content: '❌ This command can only be used in a server!',
        ephemeral: true,
      });
      return;
    }

    // Fetch additional guild data
    await guild.fetch();

    // Channel statistics
    const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;

    // Member statistics
    const members = guild.memberCount;
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humans = members - bots;

    // Boost statistics
    const boostTier = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount || 0;

    const embed = createEmbed({
      title: guild.name,
      description: guild.description || 'No description set',
      color: Colors.Primary,
    })
      .setThumbnail(guild.iconURL({ size: 256 }) || '')
      .addFields(
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '🆔 Server ID', value: guild.id, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Members', value: `**Total:** ${members}\n**Humans:** ${humans}\n**Bots:** ${bots}`, inline: true },
        { name: '📝 Channels', value: `**Text:** ${textChannels}\n**Voice:** ${voiceChannels}\n**Categories:** ${categories}`, inline: true },
        { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: '😀 Emojis', value: guild.emojis.cache.size.toString(), inline: true },
        { name: '🎨 Stickers', value: guild.stickers.cache.size.toString(), inline: true },
        { name: '💎 Boost Status', value: `**Tier:** ${boostTier}\n**Boosts:** ${boostCount}`, inline: true }
      );

    // Add verification level
    const verificationLevels: Record<number, string> = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
    };

    embed.addFields({
      name: '🔒 Verification Level',
      value: verificationLevels[guild.verificationLevel] || 'Unknown',
      inline: true,
    });

    // Add server features
    if (guild.features.length > 0) {
      const features = guild.features
        .map(feature => feature.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()))
        .slice(0, 10)
        .join(', ');

      embed.addFields({
        name: '✨ Features',
        value: features + (guild.features.length > 10 ? ` and ${guild.features.length - 10} more...` : ''),
        inline: false,
      });
    }

    // Add server banner if available
    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ size: 1024 })!);
    }

    embed.setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

    await interaction.reply({ embeds: [embed] });
  },

  category: 'General',
  guildOnly: true,
  cooldown: 5,
} as Command;

