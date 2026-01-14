import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  Message,
  PermissionResolvable,
  ClientEvents
} from 'discord.js';
import type { ExtendedClient } from '../client';

/**
 * Command execution function type
 */
export type CommandExecute = (
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction
) => Promise<void> | void;

/**
 * Prefix command execution function type
 */
export type PrefixCommandExecute = (
  client: ExtendedClient,
  message: Message,
  args: string[]
) => Promise<void> | void;

/**
 * Command structure
 */
export interface Command {
  data: SlashCommandBuilder;
  execute: CommandExecute;
  cooldown?: number; // in seconds
  permissions?: PermissionResolvable[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  category?: string;
}

/**
 * Prefix command structure
 */
export interface PrefixCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute: PrefixCommandExecute;
  cooldown?: number;
  permissions?: PermissionResolvable[];
  ownerOnly?: boolean;
  guildOnly?: boolean;
  category?: string;
}

/**
 * Event structure
 */
export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: ExtendedClient, ...args: ClientEvents[K]) => Promise<void> | void;
}

/**
 * Command category
 */
export enum CommandCategory {
  General = 'General',
  Moderation = 'Moderation',
  Utility = 'Utility',
  Fun = 'Fun',
  Admin = 'Admin',
}

/**
 * Error response options
 */
export interface ErrorOptions {
  message: string;
  ephemeral?: boolean;
  error?: Error;
}

