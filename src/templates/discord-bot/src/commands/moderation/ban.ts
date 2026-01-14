import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types';
import { successEmbed, errorEmbed } from '../../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('The member to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('delete_messages')
        .setDescription('Delete messages from the last X days (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(client, interaction) {
    if (!interaction.guild) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'This command can only be used in a server.')],
        ephemeral: true,
      });
      return;
    }

    const target = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(target!.id);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteMessageDays = interaction.options.getInteger('delete_messages') || 0;

    if (!target) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'User not found.')],
        ephemeral: true,
      });
      return;
    }

    // Check if target is the command user
    if (target.id === interaction.user.id) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'You cannot ban yourself!')],
        ephemeral: true,
      });
      return;
    }

    // Check if member is in server and is bannable
    if (member) {
      if (!member.bannable) {
        await interaction.reply({
          embeds: [errorEmbed('Error', 'I cannot ban this member. They may have a higher role than me.')],
          ephemeral: true,
        });
        return;
      }

      // Check role hierarchy
      if (interaction.member && member.roles.highest.position >= interaction.member.roles.highest.position) {
        await interaction.reply({
          embeds: [errorEmbed('Error', 'You cannot ban this member as they have a higher or equal role.')],
          ephemeral: true,
        });
        return;
      }
    }

    try {
      // Send DM to user before banning
      if (member) {
        try {
          await target.send({
            embeds: [
              errorEmbed(
                `Banned from ${interaction.guild.name}`,
                `**Reason:** ${reason}\n**Banned by:** ${interaction.user.tag}`
              ),
            ],
          });
        } catch (error) {
          // User has DMs disabled
        }
      }

      // Ban the user
      await interaction.guild.members.ban(target, {
        reason,
        deleteMessageSeconds: deleteMessageDays * 24 * 60 * 60,
      });

      await interaction.reply({
        embeds: [
          successEmbed(
            'Member Banned',
            `**User:** ${target.tag} (${target.id})\n**Reason:** ${reason}\n**Banned by:** ${interaction.user.tag}${deleteMessageDays > 0 ? `\n**Messages Deleted:** Last ${deleteMessageDays} day(s)` : ''}`
          ),
        ],
      });
    } catch (error) {
      await interaction.reply({
        embeds: [errorEmbed('Error', 'Failed to ban the member. Please try again.')],
        ephemeral: true,
      });
    }
  },

  category: 'Moderation',
  permissions: [PermissionFlagsBits.BanMembers],
  guildOnly: true,
  cooldown: 5,
} as Command;

