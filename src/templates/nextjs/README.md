# {{projectName}}

A modern, production-ready Next.js 14 application built with the App Router, TypeScript, Tailwind CSS, and Prisma.

## 🚀 Features

- ⚡ **Next.js 14** - Latest version with App Router and Server Components
- 🎨 **Tailwind CSS** - Utility-first CSS framework with custom design system
- 🔷 **TypeScript** - Full type safety with strict mode enabled
- 🗃️ **Prisma** - Type-safe database ORM with migrations
- ✅ **Zod** - Schema validation for runtime type checking
- 🎯 **ESLint & Prettier** - Code linting and formatting
- 🔐 **Ready for Auth** - Pre-configured for NextAuth.js integration
- 📦 **CRUD Operations** - Complete example with API routes
- 🎭 **Dark Mode Ready** - Theme support built-in
- 🚢 **Production Ready** - Optimized for deployment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Database** (PostgreSQL, MySQL, SQLite, or MongoDB)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your settings:

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

**PostgreSQL (default):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/{{projectName}}?schema=public"
```

**MySQL:**
```env
DATABASE_URL="mysql://user:password@localhost:3306/{{projectName}}"
```

**SQLite:**
```env
DATABASE_URL="file:./dev.db"
```

**MongoDB:**
```env
DATABASE_URL="mongodb://localhost:27017/{{projectName}}"
```

### 3. Set Up the Database

Generate Prisma Client and push the schema to your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Optional: Seed the database with sample data
npm run prisma:seed
```

For production, use migrations:

```bash
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
{{projectName}}/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   └── items/            # CRUD endpoints for items
│   ├── items/                # Items management page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Loading UI
│   ├── not-found.tsx         # 404 page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── ItemList.tsx          # Items list component
│   └── CreateItemForm.tsx    # Item creation form
├── lib/                      # Utility libraries
│   ├── db.ts                 # Prisma client instance
│   ├── utils.ts              # Helper functions
│   └── validations.ts        # Zod schemas
├── prisma/                   # Prisma configuration
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding script
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data

## 🗄️ Database Management

### Prisma Studio

View and edit your database with a GUI:

```bash
npm run prisma:studio
```

### Migrations

Create a new migration after schema changes:

```bash
npx prisma migrate dev --name your_migration_name
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

### Reset Database

⚠️ Warning: This will delete all data!

```bash
npx prisma migrate reset
```

## 🎨 Styling

This project uses Tailwind CSS with a custom design system. The theme is configured in:

- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Global styles and CSS variables

### Custom Components

UI components are built with Tailwind and follow a consistent design pattern:

- **Button** - Multiple variants (default, outline, ghost, destructive)
- **Input** - Form inputs with validation styles
- **Card** - Content containers with shadow and borders

## 🔌 API Routes

### Items API

**GET** `/api/items` - Get all items
```typescript
// Response
[
  {
    "id": 1,
    "title": "Item title",
    "description": "Item description",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**POST** `/api/items` - Create a new item
```typescript
// Request body
{
  "title": "Item title",
  "description": "Item description" // optional
}
```

**GET** `/api/items/[id]` - Get a specific item

**PUT** `/api/items/[id]` - Update an item
```typescript
// Request body
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**DELETE** `/api/items/[id]` - Delete an item

## 🔐 Adding Authentication (Optional)

This project is pre-configured for NextAuth.js. To enable authentication:

1. Install NextAuth.js:
```bash
npm install next-auth @auth/prisma-adapter
```

2. Create `app/api/auth/[...nextauth]/route.ts`

3. Add authentication providers in your `.env` file

4. Update Prisma schema with auth models (already included)

5. Run migrations:
```bash
npx prisma migrate dev
```

## 🚢 Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com):

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production URL (if using auth)
- `NEXTAUTH_SECRET` - A secure random string (if using auth)
- Any API keys for external services

### Database Setup for Production

1. Create a production database (e.g., on Vercel Postgres, PlanetScale, or Supabase)
2. Run migrations:
```bash
npx prisma migrate deploy
```

### Other Deployment Options

- **Docker**: A `Dockerfile` can be added for containerized deployment
- **Self-hosted**: Build with `npm run build` and start with `npm start`
- **Other platforms**: Works with any platform that supports Node.js

## 🧪 Testing

While not included by default, you can add testing with:

- **Jest** + **React Testing Library** for unit tests
- **Playwright** or **Cypress** for E2E tests

## 📝 Code Quality

This project enforces code quality with:

- **TypeScript** strict mode for type safety
- **ESLint** for code linting
- **Prettier** for consistent formatting
- **Zod** for runtime validation

Run checks before committing:

```bash
npm run lint
npm run type-check
npm run format
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and type checking
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zod Documentation](https://zod.dev)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ using errika
