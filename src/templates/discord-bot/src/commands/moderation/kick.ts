import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types';
import { successEmbed, errorEmbed, Colors } from '../../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(client, interaction) {
    if (!interaction.guild) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command can only be used in a server.')],
        ephemeral: true,
      });
      return;
    }

    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'User not found in this server.')],
        ephemeral: true,
      });
      return;
    }

    // Check if target is kickable
    if (!target.kickable) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'I cannot kick this member. They may have a higher role than me.')],
        ephemeral: true,
      });
      return;
    }

    // Check if target is the command user
    if (target.id === interaction.user.id) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot kick yourself!')],
        ephemeral: true,
      });
      return;
    }

    // Check role hierarchy
    if (interaction.member && target.roles.highest.position >= interaction.member.roles.highest.position) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot kick this member as they have a higher or equal role.')],
        ephemeral: true,
      });
      return;
    }

    try {
      // Send DM to user before kicking
      try {
        await target.send({
          embeds: [
            errorEmbed(
              `Kicked from ${interaction.guild.name}`,
              `**Reason:** ${reason}\n**Kicked by:** ${interaction.user.tag}`
            ),
          ],
        });
      } catch (error) {
        // User has DMs disabled
      }

      // Kick the member
      await target.kick(reason);

      await interaction.reply({
        embeds: [
          successEmbed(
            'Member Kicked',
            `**Member:** ${target.user.tag} (${target.id})\n**Reason:** ${reason}\n**Kicked by:** ${interaction.user.tag}`
          ),
        ],
      });
    } catch (error) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to kick the member. Please try again.')],
        ephemeral: true,
      });
    }
  },

  category: 'Moderation',
  permissions: [PermissionFlagsBits.KickMembers],
  guildOnly: true,
  cooldown: 5,
} as Command;

