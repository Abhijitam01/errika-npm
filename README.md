# Errika

A powerful CLI tool for scaffolding modern web projects with best practices built-in.

## 📚 Documentation

All project documentation has been moved to the [`docs`](/docs) folder:

- **[Main Documentation](./docs/README.md)** - Complete project overview and usage guide
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Contributing and development setup
- **[Testing Guide](./docs/TESTING_GUIDE.md)** - Running and writing tests
- **[Changelog](./docs/CHANGELOG.md)** - Version history and updates
- **[Security Enhancements](./docs/SECURITY_ENHANCEMENTS.md)** - Security features and best practices
- **[Test Coverage](./docs/TEST_COVERAGE.md)** - Test coverage information
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Privacy Policy](./PRIVACY.md)** - Analytics and privacy information

## Quick Start

```bash
npx create-errika my-app
```

## 🔍 Template Validation

Errika includes a comprehensive template validation system to ensure quality and security:

```bash
# Validate a specific template
npx create-errika validate nextjs

# Validate all templates
npx create-errika validate --all
```

See the [Validation Guide](./docs/VALIDATION.md) for details.

## 📊 Usage Statistics

Errika includes optional anonymous usage analytics to help improve the tool. You'll be asked for consent on first use.

**View your stats:**
```bash
npx create-errika stats
```

**Manage analytics:**
```bash
# Check status
npx create-errika analytics status

# Enable/disable
npx create-errika analytics enable
npx create-errika analytics disable

# Remove all data
npx create-errika analytics reset
```

**Privacy First:** We only track template usage and success rates. Never project names, code, or personal data. See our [Privacy Policy](./PRIVACY.md) for details.

For detailed documentation, please visit the [docs folder](./docs).

