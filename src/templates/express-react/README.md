# {{projectName}}

A modern full-stack application built with Express.js, React, TypeScript, and Prisma. This monorepo includes a REST API backend and a React frontend with authentication, CRUD operations, and beautiful UI.

## 🚀 Features

### Backend (Express.js)
- ⚡ **Express.js** - Fast, unopinionated web framework
- 🔷 **TypeScript** - Full type safety
- 🗃️ **Prisma** - Next-generation ORM
- 🔐 **JWT Authentication** - Secure user authentication
- ✅ **Zod** - Runtime validation
- 🛡️ **Security** - CORS, password hashing, error handling
- 📝 **Request Logging** - Detailed API logging

### Frontend (React)
- ⚛️ **React 18** - Latest React with hooks
- ⚡ **Vite** - Lightning-fast build tool
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧭 **React Router** - Client-side routing
- 🔐 **Protected Routes** - Authentication-based routing
- 📡 **Axios** - HTTP client with interceptors
- 🎯 **Custom Hooks** - Reusable logic (useAuth, useAPI)

## 📋 Prerequisites

- **Node.js** 18.0.0 or later
- **npm**, **yarn**, or **pnpm** package manager
- **Database** (PostgreSQL, MySQL, SQLite, or MongoDB)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm install
```

### 2. Configure Backend Environment

```bash
cd backend
cp env.example .env
```

Edit `backend/.env` and configure your database:

**PostgreSQL (default):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/{{projectName}}"
JWT_SECRET="your-secret-key-change-in-production"
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

### 3. Configure Frontend Environment (Optional)

```bash
cd frontend
cp env.example .env
```

Edit `frontend/.env` if you need to change the API URL:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with demo data
npm run prisma:seed
```

### 5. Start Development Servers

```bash
# Start both backend and frontend concurrently
npm run dev

# Or start them separately:
npm run dev:backend   # Backend on http://localhost:3001
npm run dev:frontend  # Frontend on http://localhost:5173
```

## 📁 Project Structure

```
{{projectName}}/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── index.ts           # Express server setup
│   │   ├── routes/            # API routes
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── items.ts       # CRUD routes
│   │   │   └── users.ts       # User routes
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── itemController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts        # JWT authentication
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   └── requestLogger.ts
│   │   ├── services/          # Business logic
│   │   │   └── db.ts          # Prisma client
│   │   └── types/             # TypeScript types
│   │       └── schemas.ts     # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── main.tsx           # Entry point
│   │   ├── App.tsx            # Root component
│   │   ├── pages/             # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Items.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/        # Reusable components
│   │   │   └── Layout.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useAPI.ts
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/          # API services
│   │   │   └── api.ts         # Axios instance
│   │   └── types/             # TypeScript types
│   │       └── index.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── package.json               # Root workspace config
├── .gitignore
└── README.md
```

## 🔧 Available Scripts

### Root (Monorepo)

- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run build` - Build both projects
- `npm run lint` - Lint all code
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Items (Protected)

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (requires auth)
- `PUT /api/items/:id` - Update item (requires auth)
- `DELETE /api/items/:id` - Delete item (requires auth)

### Users (Protected)

- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

## 🔐 Authentication

This project uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in localStorage
4. Token is sent with each request in Authorization header
5. Backend middleware validates token

### Demo Credentials

After seeding the database:
- **Email**: demo@example.com
- **Password**: Demo123!

## 🗄️ Database Management

### Prisma Studio

View and edit your database with a GUI:

```bash
npm run prisma:studio
```

### Migrations

```bash
# Create a new migration
cd backend
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy
```

### Reset Database

⚠️ Warning: This will delete all data!

```bash
cd backend
npx prisma migrate reset
```

## 🎨 Styling

The frontend uses **Tailwind CSS** for styling. Customize the theme in `frontend/tailwind.config.js`.

### Custom Colors

The primary color palette can be customized in the Tailwind config.

## 🚢 Deployment

### Backend Deployment

1. **Environment Variables**
   - Set `DATABASE_URL` to production database
   - Set `JWT_SECRET` to a secure random string
   - Set `NODE_ENV` to "production"
   - Set `FRONTEND_URL` for CORS

2. **Build**
   ```bash
   cd backend
   npm run build
   ```

3. **Start**
   ```bash
   npm run start
   ```

### Frontend Deployment

1. **Environment Variables**
   - Set `VITE_API_URL` to production API URL

2. **Build**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   - Upload `dist/` folder to hosting provider (Vercel, Netlify, etc.)

### Recommended Platforms

- **Backend**: Railway, Render, Fly.io, AWS, Heroku
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Railway, PlanetScale, Supabase, Neon

## 🧪 Testing

While not included by default, you can add testing with:

- **Backend**: Jest, Supertest
- **Frontend**: Vitest, React Testing Library

## 📝 Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Zod** - Runtime validation
- **Prisma** - Type-safe database access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Powered by [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)

---

Made with ❤️ using errika
