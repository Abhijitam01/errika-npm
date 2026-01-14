#!/bin/bash

# Errika Web Dashboard Setup Script
# This script helps you get started quickly

echo "🎨 Errika Web Dashboard Setup"
echo "=============================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    echo "   Please upgrade Node.js and try again"
    exit 1
fi

echo "✅ Node.js version check passed ($(node -v))"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the web-dashboard directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Detect package manager
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Errika Web Dashboard Environment Variables
# Uncomment and fill in the values you need

# Database (Optional - for statistics)
# POSTGRES_URL=
# POSTGRES_PRISMA_URL=
# POSTGRES_URL_NON_POOLING=

# Analytics (Optional)
# NEXT_PUBLIC_GA_ID=

# Authentication (Optional)
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=
EOF
    echo "✅ Created .env.local file"
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "=============================="
echo "🎉 Setup Complete!"
echo "=============================="
echo ""
echo "To start the development server:"
echo ""
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Project overview"
echo "  - FEATURES.md - Feature documentation"
echo "  - DEPLOYMENT.md - Deployment guide"
echo "  - WEB_DASHBOARD_SUMMARY.md - Complete summary"
echo ""
echo "Happy building! 🚀"

