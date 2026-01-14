# Contributing to {{projectName}}

Thank you for your interest in contributing to this Discord bot! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js v18.0.0 or higher
- A package manager (npm, yarn, pnpm, or bun)
- A Discord application and bot token
- Git

### Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd {{projectName}}
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your Discord credentials
```

4. Register commands:
```bash
npm run register
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── commands/          # Command modules
│   ├── general/      # General commands
│   └── moderation/   # Moderation commands
├── events/           # Event handlers
├── handlers/         # Command and event loaders
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── client.ts         # Extended Discord client
├── config.ts         # Configuration management
└── index.ts          # Main entry point
```

## Adding a New Command

### 1. Create the Command File

Create a new file in `src/commands/` (or a subdirectory like `src/commands/fun/`):

```typescript
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';
import { createEmbed, Colors } from '../utils/embedBuilder';

export default {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('Description of my command')
    .addStringOption(option =>
      option
        .setName('input')
        .setDescription('Some input')
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const input = interaction.options.getString('input', true);
    
    await interaction.reply({
      embeds: [
        createEmbed({
          title: 'My Command',
          description: `You said: ${input}`,
          color: Colors.Primary,
        }),
      ],
    });
  },

  // Optional properties
  category: 'Fun',
  cooldown: 5, // seconds
  permissions: [], // Required permissions
  guildOnly: false, // Can be used in DMs
  ownerOnly: false, // Owner-only command
} as Command;
```

### 2. Register the Command

```bash
npm run register
```

### 3. Test the Command

Restart the bot and test your command:
```bash
npm run dev
```

## Adding a New Event

Create a new file in `src/events/`:

```typescript
import { Events } from 'discord.js';
import type { BotEvent } from '../types';
import { logger } from '../utils/logger';

export default {
  name: Events.MessageDelete,
  once: false,

  async execute(client, message) {
    logger.event('Message Deleted', `${message.author?.tag || 'Unknown'}`);
    
    // Your event handling logic here
  },
} as BotEvent<Events.MessageDelete>;
```

The event will be automatically loaded on bot restart.

## Code Style

### TypeScript

- Use TypeScript for all files
- Enable strict mode
- Properly type all functions and variables
- Use interfaces for complex types

### Formatting

- Use Prettier for formatting (config provided)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required

Run formatter:
```bash
npm run format
```

### Linting

- Use ESLint (config provided)
- Fix all linting errors before committing

Run linter:
```bash
npm run lint
```

## Best Practices

### Commands

1. **Use slash commands** - They're the modern standard
2. **Add descriptions** - Clear, concise command descriptions
3. **Validate input** - Always validate user input
4. **Handle errors** - Use try-catch blocks
5. **Use embeds** - Make responses visually appealing
6. **Add cooldowns** - Prevent spam and abuse
7. **Check permissions** - Validate user and bot permissions

### Events

1. **Keep them lightweight** - Events should be fast
2. **Handle errors** - Don't let events crash the bot
3. **Log important events** - Use the logger utility
4. **Avoid blocking operations** - Use async/await properly

### Error Handling

Always handle errors gracefully:

```typescript
try {
  await someAsyncOperation();
} catch (error) {
  logger.error('Operation failed:', error as Error);
  await interaction.reply({
    embeds: [errorEmbed('Error', 'Something went wrong!')],
    ephemeral: true,
  });
}
```

## Testing

### Manual Testing

1. Test in a development server with `GUILD_ID` set
2. Test all command options and edge cases
3. Test permission checks
4. Test error scenarios

### Test Checklist

- [ ] Command appears in Discord
- [ ] Command executes without errors
- [ ] Error messages are clear and helpful
- [ ] Permissions are checked correctly
- [ ] Cooldowns work as expected
- [ ] Works in both servers and DMs (if applicable)
- [ ] Bot has required permissions
- [ ] No console errors or warnings

## Git Workflow

### Branching

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes

### Commits

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add coin flip command"
git commit -m "fix: handle missing permissions in kick command"
git commit -m "docs: update README with new commands"
```

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Pull Requests

### Before Submitting

1. Test your changes thoroughly
2. Run linter: `npm run lint`
3. Run formatter: `npm run format`
4. Update documentation if needed
5. Add yourself to CONTRIBUTORS.md

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
```

## Database Changes

If you add database functionality:

1. Update `prisma/schema.prisma`
2. Generate Prisma client: `npm run db:generate`
3. Create migration: `npm run db:push`
4. Document the changes in your PR

## Need Help?

- Read the [Discord.js Guide](https://discordjs.guide/)
- Check the [Discord.js Documentation](https://discord.js.org/)
- Ask in our Discord server
- Open an issue for bugs or questions

## Code of Conduct

- Be respectful and constructive
- Help others learn and grow
- Focus on what's best for the community
- Show empathy towards other contributors

Thank you for contributing! 🎉

