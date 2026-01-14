import { Client, Collection, GatewayIntentBits } from 'discord.js';
import type { Command, BotEvent } from './types';

/**
 * Extended Discord Client with command and cooldown management
 */
export class ExtendedClient extends Client {
  public commands: Collection<string, Command>;
  public cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
      ],
    });

    this.commands = new Collection();
    this.cooldowns = new Collection();
  }

  /**
   * Get a command by name
   */
  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  /**
   * Set a command
   */
  public setCommand(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  /**
   * Check if user is on cooldown for a command
   */
  public isOnCooldown(userId: string, commandName: string): boolean {
    const cooldown = this.getCooldown(userId, commandName);
    if (!cooldown) return false;

    const now = Date.now();
    return cooldown > now;
  }

  /**
   * Get remaining cooldown time in seconds
   */
  public getCooldownTime(userId: string, commandName: string): number {
    const cooldown = this.getCooldown(userId, commandName);
    if (!cooldown) return 0;

    const now = Date.now();
    const timeLeft = cooldown - now;
    return Math.ceil(timeLeft / 1000);
  }

  /**
   * Set cooldown for a user on a command
   */
  public setCooldown(userId: string, commandName: string, duration: number): void {
    if (!this.cooldowns.has(commandName)) {
      this.cooldowns.set(commandName, new Collection());
    }

    const timestamps = this.cooldowns.get(commandName)!;
    const expirationTime = Date.now() + duration * 1000;
    timestamps.set(userId, expirationTime);

    setTimeout(() => timestamps.delete(userId), duration * 1000);
  }

  /**
   * Get cooldown expiration time for a user
   */
  private getCooldown(userId: string, commandName: string): number | undefined {
    const timestamps = this.cooldowns.get(commandName);
    if (!timestamps) return undefined;

    return timestamps.get(userId);
  }
}

