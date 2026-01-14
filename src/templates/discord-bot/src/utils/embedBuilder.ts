import { EmbedBuilder, ColorResolvable, User, Guild } from 'discord.js';

/**
 * Color palette for embeds
 */
export const Colors = {
  Primary: 0x5865f2 as ColorResolvable,
  Success: 0x57f287 as ColorResolvable,
  Warning: 0xfee75c as ColorResolvable,
  Error: 0xed4245 as ColorResolvable,
  Info: 0x5865f2 as ColorResolvable,
} as const;

/**
 * Create a basic embed with default styling
 */
export function createEmbed(options?: {
  title?: string;
  description?: string;
  color?: ColorResolvable;
  footer?: string;
  timestamp?: boolean;
}): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(options?.color || Colors.Primary)
    .setTimestamp(options?.timestamp !== false ? new Date() : null);

  if (options?.title) embed.setTitle(options.title);
  if (options?.description) embed.setDescription(options.description);
  if (options?.footer) embed.setFooter({ text: options.footer });

  return embed;
}

/**
 * Create a success embed
 */
export function successEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed({
    title: `✅ ${title}`,
    description,
    color: Colors.Success,
  });
}

/**
 * Create an error embed
 */
export function errorEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed({
    title: `❌ ${title}`,
    description,
    color: Colors.Error,
  });
}

/**
 * Create a warning embed
 */
export function warningEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed({
    title: `⚠️ ${title}`,
    description,
    color: Colors.Warning,
  });
}

/**
 * Create an info embed
 */
export function infoEmbed(title: string, description?: string): EmbedBuilder {
  return createEmbed({
    title: `ℹ️ ${title}`,
    description,
    color: Colors.Info,
  });
}

/**
 * Create a user info embed
 */
export function userInfoEmbed(user: User): EmbedBuilder {
  const embed = createEmbed({
    title: 'User Information',
    color: Colors.Primary,
  })
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'Username', value: user.username, inline: true },
      { name: 'Display Name', value: user.displayName || 'None', inline: true },
      { name: 'User ID', value: user.id, inline: true },
      { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
      { name: 'Created At', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false }
    );

  return embed;
}

/**
 * Create a server info embed
 */
export function serverInfoEmbed(guild: Guild): EmbedBuilder {
  const embed = createEmbed({
    title: guild.name,
    description: guild.description || 'No description',
    color: Colors.Primary,
  })
    .setThumbnail(guild.iconURL({ size: 256 }) || '')
    .addFields(
      { name: 'Server ID', value: guild.id, inline: true },
      { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
      { name: 'Members', value: guild.memberCount.toString(), inline: true },
      { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
      { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true },
      { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
    );

  if (guild.bannerURL()) {
    embed.setImage(guild.bannerURL({ size: 1024 })!);
  }

  return embed;
}

/**
 * Create a cooldown embed
 */
export function cooldownEmbed(timeLeft: number): EmbedBuilder {
  return warningEmbed(
    'Command Cooldown',
    `Please wait ${timeLeft} more second(s) before using this command again.`
  );
}

/**
 * Create a permission error embed
 */
export function permissionErrorEmbed(permission: string): EmbedBuilder {
  return errorEmbed(
    'Missing Permissions',
    `You need the **${permission}** permission to use this command.`
  );
}

/**
 * Create a bot permission error embed
 */
export function botPermissionErrorEmbed(permission: string): EmbedBuilder {
  return errorEmbed(
    'Bot Missing Permissions',
    `I need the **${permission}** permission to execute this command.`
  );
}

