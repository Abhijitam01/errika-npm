# Errika Web Dashboard

The official web dashboard for [Errika](https://errika.dev) - a modern project template generator.

## 🌟 Features

- **Beautiful Landing Page** - Showcase all templates with modern design
- **Interactive Template Explorer** - Filter and search templates by technology
- **Online Generator** - Generate and download projects as ZIP directly from browser
- **Template Comparison** - Compare templates side-by-side
- **Documentation Hub** - Complete documentation with search
- **Community Showcase** - Display projects built with Errika
- **Statistics Tracking** - Track downloads, views, and popularity
- **Responsive Design** - Works perfectly on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Vercel Postgres (optional)
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
web-dashboard/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── compare/           # Template comparison page
│   │   ├── docs/              # Documentation pages
│   │   ├── generate/          # Online generator
│   │   ├── showcase/          # Community showcase
│   │   ├── templates/         # Template explorer
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   └── ...
│   └── lib/                   # Utilities and helpers
│       └── db/               # Database schemas and queries
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (optional, for statistics)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_user
POSTGRES_HOST=your_host
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=your_database

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  primary: { ... },
  accent: { ... }
}
```

### Templates

Update templates data in `src/lib/db/templates.ts`

### Content

Modify components in `src/components/` to customize the content and layout.

## 📊 Database Setup

If you want to track statistics:

1. Set up a Postgres database (Vercel Postgres recommended)
2. Run the schema from `src/lib/db/schema.sql`
3. Add environment variables
4. Deploy!

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Build the static export:

```bash
npm run build
```

Deploy the `.next` directory to any Node.js hosting provider.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Errika NPM Package](https://www.npmjs.com/package/create-errika)
- [GitHub Repository](https://github.com/yourusername/errika)
- [Documentation](https://errika.dev/docs)
- [Community Showcase](https://errika.dev/showcase)

## 💬 Support

- [GitHub Issues](https://github.com/yourusername/errika/issues)
- [Discord Community](https://discord.gg/errika)
- [Twitter](https://twitter.com/errikadev)

---

Built with ❤️ by the Errika team



