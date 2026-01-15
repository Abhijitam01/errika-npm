# Deployment Guide for Errika Web Dashboard

This guide covers deploying the Errika web dashboard to various platforms.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Railway](#railway)
- [Docker](#docker)
- [Environment Variables](#environment-variables)

## Vercel (Recommended)

Vercel is the recommended platform as Next.js is built by Vercel and has first-class support.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables** (Optional)
   - Add environment variables in Vercel dashboard
   - See [Environment Variables](#environment-variables) section below

4. **Deploy**
   - Click "Deploy"
   - Your site will be live in minutes!

### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., errika.dev)
4. Update your DNS records as instructed

## Netlify

### Steps:

1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Connect your GitHub repository
   - Netlify will auto-detect Next.js
   - Add environment variables in Netlify dashboard
   - Deploy!

## Railway

Railway is great for applications that need databases or other services.

### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Add Variables**
   ```bash
   railway variables set KEY=VALUE
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build
docker build -t errika-web .

# Run
docker run -p 3000:3000 errika-web
```

## Environment Variables

### Required Variables

None! The app works without any environment variables.

### Optional Variables

#### Database (for statistics tracking)

```env
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_db_user
POSTGRES_HOST=your_db_host
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name
```

#### Analytics

```env
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your_plausible_domain
```

#### Authentication (for community features)

```env
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_random_secret_string
```

#### Email Service

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM=noreply@errika.dev
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Post-Deployment Checklist

- [ ] Custom domain configured
- [ ] SSL certificate active (should be automatic)
- [ ] Environment variables set
- [ ] Database migrations run (if using database)
- [ ] Analytics tracking verified
- [ ] Error monitoring set up (Sentry, LogRocket, etc.)
- [ ] Performance monitoring checked (Vercel Analytics, etc.)
- [ ] SEO metadata verified
- [ ] Social media preview images tested
- [ ] Contact forms tested
- [ ] API routes tested

## Performance Optimization

### Enable Caching

1. **Vercel**: Automatic with ISR
2. **Netlify**: Use `Cache-Control` headers
3. **Other platforms**: Configure CDN caching

### Image Optimization

Images are automatically optimized by Next.js Image component. Ensure your hosting platform supports this:

- ✅ Vercel: Built-in support
- ✅ Netlify: Via plugin
- ⚠️ Self-hosted: May need additional configuration

### Database Connection Pooling

If using a database, enable connection pooling:

```env
POSTGRES_URL=your_pooling_connection_string
```

## Monitoring

### Recommended Tools

1. **Vercel Analytics** - Built-in performance monitoring
2. **Sentry** - Error tracking
3. **LogRocket** - Session replay
4. **Plausible/Fathom** - Privacy-friendly analytics

### Setting up Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Troubleshooting

### Build Fails

1. Check Node.js version (requires 18+)
2. Clear build cache
3. Check environment variables
4. Review build logs

### Database Connection Issues

1. Verify connection string
2. Check firewall rules
3. Ensure database is accessible from deployment platform
4. Test connection locally

### API Routes Not Working

1. Check route files are in `src/app/api/`
2. Verify export syntax
3. Check CORS configuration
4. Review platform-specific requirements

## Rolling Back

### Vercel

```bash
vercel rollback
```

Or use the Vercel dashboard to redeploy a previous deployment.

### Other Platforms

Redeploy from a previous Git commit or use platform-specific rollback features.

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Platform-specific documentation
- [GitHub Issues](https://github.com/yourusername/errika/issues)
- [Discord Community](https://discord.gg/errika)

---

Happy deploying! 🚀



