import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types';
import { successEmbed, errorEmbed } from '../../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member (prevent them from sending messages)')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to timeout')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Duration in minutes (1-40320 = 28 days)')
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(client, interaction) {
    if (!interaction.guild) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command can only be used in a server.')],
        ephemeral: true,
      });
      return;
    }

    const target = interaction.options.getMember('target');
    const duration = interaction.options.getInteger('duration', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'User not found in this server.')],
        ephemeral: true,
      });
      return;
    }

    // Check if target is moderatable
    if (!target.moderatable) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'I cannot timeout this member. They may have a higher role than me.')],
        ephemeral: true,
      });
      return;
    }

    // Check if target is the command user
    if (target.id === interaction.user.id) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot timeout yourself!')],
        ephemeral: true,
      });
      return;
    }

    // Check role hierarchy
    if (interaction.member && target.roles.highest.position >= interaction.member.roles.highest.position) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot timeout this member as they have a higher or equal role.')],
        ephemeral: true,
      });
      return;
    }

    try {
      // Calculate timeout end time
      const timeoutUntil = Date.now() + duration * 60 * 1000;

      // Send DM to user before timeout
      try {
        await target.send({
          embeds: [
            errorEmbed(
              `Timed out in ${interaction.guild.name}`,
              `**Duration:** ${duration} minute(s)\n**Reason:** ${reason}\n**Timed out by:** ${interaction.user.tag}\n**Expires:** <t:${Math.floor(timeoutUntil / 1000)}:R>`
            ),
          ],
        });
      } catch (error) {
        // User has DMs disabled
      }

      // Timeout the member
      await target.timeout(duration * 60 * 1000, reason);

      // Format duration for display
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      let durationStr = '';
      if (hours > 0) durationStr += `${hours}h `;
      if (minutes > 0) durationStr += `${minutes}m`;

      await interaction.reply({
        embeds: [
          successEmbed(
            'Member Timed Out',
            `**Member:** ${target.user.tag} (${target.id})\n**Duration:** ${durationStr.trim()}\n**Reason:** ${reason}\n**Timed out by:** ${interaction.user.tag}\n**Expires:** <t:${Math.floor(timeoutUntil / 1000)}:R>`
          ),
        ],
      });
    } catch (error) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to timeout the member. Please try again.')],
        ephemeral: true,
      });
    }
  },

  category: 'Moderation',
  permissions: [PermissionFlagsBits.ModerateMembers],
  guildOnly: true,
  cooldown: 5,
} as Command;

