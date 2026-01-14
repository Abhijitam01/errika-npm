import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency and API ping'),

  async execute(client, interaction) {
    const sent = await interaction.reply({
      content: '🏓 Pinging...',
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    // Determine status based on latency
    let status = '🟢 Excellent';
    let color = Colors.Success;

    if (latency > 200 || apiLatency > 200) {
      status = '🟡 Good';
      color = Colors.Warning;
    }

    if (latency > 500 || apiLatency > 500) {
      status = '🟠 Fair';
      color = Colors.Warning;
    }

    if (latency > 1000 || apiLatency > 1000) {
      status = '🔴 Poor';
      color = Colors.Error;
    }

    const embed = createEmbed({
      title: '🏓 Pong!',
      color,
    })
      .addFields(
        { name: 'Bot Latency', value: `\`${latency}ms\``, inline: true },
        { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true },
        { name: 'Status', value: status, inline: true }
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({
      content: null,
      embeds: [embed],
    });
  },

  category: 'General',
  cooldown: 3,
} as Command;
