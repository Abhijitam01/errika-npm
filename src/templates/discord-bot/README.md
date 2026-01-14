# {{projectName}}

A production-ready Discord bot built with [discord.js v14](https://discord.js.org/), TypeScript, and modern best practices.

## 🚀 Features

- ✅ **Discord.js v14** - Latest version with full TypeScript support
- ✅ **Slash Commands** - Modern Discord command system
- ✅ **Event Handling** - Modular event system
- ✅ **Command Cooldowns** - Built-in rate limiting
- ✅ **Permission Checks** - Automatic permission validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Hot Reload** - Development mode with auto-restart
- ✅ **Graceful Shutdown** - Proper cleanup on exit
- ✅ **Colored Logging** - Beautiful console output
- ✅ **Production Ready** - Optimized for deployment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- A [Discord account](https://discord.com/)

## 🛠️ Setup

### 1. Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "Bot" section
4. Click "Add Bot" and confirm
5. **Important:** Enable the following Privileged Gateway Intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent (if using prefix commands)

### 2. Get Your Bot Token

1. In the "Bot" section, click "Reset Token"
2. Copy the token (keep it secret!)
3. Save it for the next step

### 3. Get Your Client ID

1. Navigate to the "OAuth2" section
2. Copy your "Client ID"
3. Save it for the configuration

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_for_testing  # Optional, for faster development
```

### 5. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 6. Register Slash Commands

Register your commands with Discord:

```bash
npm run register
# or
yarn register
# or
pnpm register
# or
bun register
```

**Note:** 
- If you provided a `GUILD_ID`, commands will be registered instantly to that server
- Without `GUILD_ID`, commands are registered globally (takes up to 1 hour)

## 🎮 Usage

### Development Mode

Start the bot with hot reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Production Mode

Build and run the bot:

```bash
npm run build
npm start
# or
yarn build && yarn start
# or
pnpm build && pnpm start
# or
bun build && bun start
```

## 📝 Available Commands

### General Commands

- `/ping` - Check the bot's latency and API response time
- `/help` - Display all available commands or get help for a specific command
- `/userinfo [user]` - Get detailed information about a user
- `/serverinfo` - Get information about the current server

### Moderation Commands

*These commands require appropriate permissions*

- `/kick <user> [reason]` - Kick a member from the server
- `/ban <user> [reason]` - Ban a member from the server
- `/timeout <user> <duration> [reason]` - Timeout a member (mute)

## 🔐 Bot Permissions

Your bot needs the following permissions to function properly:

### Required Permissions
- View Channels
- Send Messages
- Embed Links
- Read Message History

### For Moderation Commands
- Kick Members
- Ban Members
- Timeout Members

### Permission Integer

For a basic setup, use this permission integer when inviting your bot: `8` (Administrator)

For production, calculate specific permissions at: [Discord Permissions Calculator](https://discordapi.com/permissions.html)

## 🤝 Inviting Your Bot

Create an invite link using one of these methods:

### Method 1: Discord Developer Portal

1. Go to your application in the [Developer Portal](https://discord.com/developers/applications)
2. Navigate to "OAuth2" > "URL Generator"
3. Select scopes: `bot`, `applications.commands`
4. Select permissions based on your needs
5. Copy and use the generated URL

### Method 2: Manual URL

Replace `YOUR_CLIENT_ID` with your actual client ID:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## 📁 Project Structure

```
{{projectName}}/
├── src/
│   ├── commands/          # Command modules
│   │   ├── help.ts
│   │   ├── ping.ts
│   │   ├── userinfo.ts
│   │   ├── serverinfo.ts
│   │   └── moderation/    # Moderation commands
│   │       ├── kick.ts
│   │       ├── ban.ts
│   │       └── timeout.ts
│   ├── events/            # Event handlers
│   │   ├── ready.ts
│   │   ├── interactionCreate.ts
│   │   ├── messageCreate.ts
│   │   └── guildMemberAdd.ts
│   ├── handlers/          # Loaders
│   │   ├── commandHandler.ts
│   │   └── eventHandler.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── logger.ts
│   │   └── embedBuilder.ts
│   ├── client.ts          # Extended client class
│   ├── config.ts          # Configuration management
│   ├── index.ts           # Main entry point
│   └── register-commands.ts  # Command registration
├── .env                   # Environment variables (create from env.example)
├── env.example            # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Adding New Commands

### 1. Create a command file

Create a new file in `src/commands/`:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types';

export default {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My awesome command'),

  async execute(client, interaction) {
    await interaction.reply('Hello, world!');
  },

  category: 'General',
  cooldown: 5, // seconds
} as Command;
```

### 2. Register the command

```bash
npm run register
```

### 3. Restart the bot

The command will be automatically loaded on restart.

## 📊 Database (Optional)

If you selected Prisma database integration:

### Setup Database

1. Configure your `DATABASE_URL` in `.env`
2. Generate Prisma client:

```bash
npm run db:generate
```

3. Push schema to database:

```bash
npm run db:push
```

4. Open Prisma Studio (optional):

```bash
npm run db:studio
```

### Using Prisma in Commands

```typescript
import { prisma } from '../../prisma/client';

// In your command execute function
const user = await prisma.user.findUnique({
  where: { id: interaction.user.id }
});
```

## 🐛 Debugging

### Enable Debug Logging

Set `NODE_ENV=development` in your `.env` file to enable debug logs.

### Common Issues

**Bot doesn't respond to commands:**
- Make sure you registered commands with `npm run register`
- Check if bot has proper permissions in your server
- Verify bot intents are enabled in Developer Portal

**"Missing Access" errors:**
- Check channel permissions
- Verify bot role hierarchy

**Commands not showing up:**
- Wait a few minutes (global commands can take up to 1 hour)
- Use `GUILD_ID` for instant registration during development

## 📦 Deployment

### Heroku

1. Create a `Procfile`:
```
worker: npm start
```

2. Deploy:
```bash
git push heroku main
```

3. Scale the worker:
```bash
heroku ps:scale worker=1
```

### VPS (Ubuntu/Debian)

1. Install Node.js and PM2:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

2. Build and start:
```bash
npm run build
pm2 start dist/index.js --name discord-bot
pm2 save
pm2 startup
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t discord-bot .
docker run -d --env-file .env discord-bot
```

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Discord API Documentation](https://discord.com/developers/docs/intro)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

Need help? Join our Discord server: [Your Discord Server Link]

## ⭐ Acknowledgments

- Built with [discord.js](https://discord.js.org/)
- Created with [errika](https://www.npmjs.com/package/errika)

---

Made with ❤️ by [Your Name]
