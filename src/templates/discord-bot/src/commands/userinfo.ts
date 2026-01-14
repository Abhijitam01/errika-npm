import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to get information about')
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild?.members.cache.get(targetUser.id);

    const embed = createEmbed({
      title: 'User Information',
      color: Colors.Primary,
    })
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Username', value: targetUser.username, inline: true },
        { name: 'Display Name', value: targetUser.displayName || 'None', inline: true },
        { name: 'User ID', value: targetUser.id, inline: true },
        { name: 'Bot', value: targetUser.bot ? '✅ Yes' : '❌ No', inline: true },
        { 
          name: 'Account Created', 
          value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>\n(<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>)`, 
          inline: false 
        }
      );

    // Add server-specific information if in a guild
    if (member) {
      const roles = member.roles.cache
        .filter(role => role.id !== interaction.guild?.id)
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, 10);

      embed.addFields(
        { 
          name: 'Nickname', 
          value: member.nickname || 'None', 
          inline: true 
        },
        { 
          name: 'Joined Server', 
          value: member.joinedAt 
            ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>\n(<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>)` 
            : 'Unknown', 
          inline: false 
        },
        { 
          name: `Roles [${member.roles.cache.size - 1}]`, 
          value: roles.length > 0 ? roles.join(', ') : 'None', 
          inline: false 
        }
      );

      // Add status and presence if available
      if (member.presence) {
        const status = member.presence.status;
        const statusEmojis = {
          online: '🟢',
          idle: '🟡',
          dnd: '🔴',
          offline: '⚫',
        };

        embed.addFields({
          name: 'Status',
          value: `${statusEmojis[status]} ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          inline: true,
        });
      }

      // Add boost status if boosting
      if (member.premiumSince) {
        embed.addFields({
          name: 'Server Booster',
          value: `✨ Since <t:${Math.floor(member.premiumSinceTimestamp! / 1000)}:R>`,
          inline: true,
        });
      }
    }

    // Add user badges if available
    const flags = targetUser.flags?.toArray() || [];
    if (flags.length > 0) {
      const badgeEmojis: Record<string, string> = {
        Staff: '🛡️',
        Partner: '🤝',
        Hypesquad: '🎉',
        BugHunterLevel1: '🐛',
        BugHunterLevel2: '🐛',
        HypeSquadOnlineHouse1: '⚔️',
        HypeSquadOnlineHouse2: '🎨',
        HypeSquadOnlineHouse3: '⚖️',
        PremiumEarlySupporter: '⭐',
        VerifiedDeveloper: '✅',
        CertifiedModerator: '🛡️',
        ActiveDeveloper: '⚒️',
      };

      const badges = flags.map(flag => `${badgeEmojis[flag] || '🏅'} ${flag}`).join('\n');
      embed.addFields({
        name: 'Badges',
        value: badges,
        inline: false,
      });
    }

    embed.setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    });

    await interaction.reply({ embeds: [embed] });
  },

  category: 'General',
  cooldown: 3,
} as Command;

