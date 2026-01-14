# Privacy Policy for Errika

**Last Updated:** January 14, 2026

## Overview

Errika respects your privacy. This document explains what data we collect (if you opt-in), how we use it, and how you can control your data.

## Anonymous Usage Analytics

Errika includes an **optional** anonymous usage analytics feature. This feature is **completely opt-in** and requires your explicit consent.

### What We Collect

When you **opt-in** to analytics, we collect only the following information:

- **Template name**: Which template you used (e.g., "nextjs", "turborepo")
- **Success/failure status**: Whether the project was created successfully
- **Timestamp**: When the project was created
- **Node.js version**: Your Node.js version (e.g., "v18.17.0")
- **Package manager**: Which package manager you selected (e.g., "npm", "pnpm")
- **Error type** (if failed): A generic category of error (e.g., "directory_not_empty")
- **Anonymous User ID**: A randomly generated UUID that cannot be linked to your identity

### What We DON'T Collect

We **never** collect:

- ❌ Project names or paths
- ❌ Personal information (name, email, IP address, etc.)
- ❌ Code or file contents
- ❌ Environment variables
- ❌ Computer or system information (beyond Node.js version)
- ❌ Any sensitive or personally identifiable data

### How We Use The Data

Analytics data helps us:

1. Understand which templates are most popular
2. Identify common failure patterns to improve error handling
3. Make data-driven decisions about which features to prioritize
4. Improve the overall user experience

### Data Storage

- **Local Storage**: All analytics data is stored locally on your machine in `~/.errika/analytics.json`
- **Remote Storage**: If you opt-in, anonymized data is sent to our analytics backend
- **Data Retention**: We retain anonymized analytics data for up to 2 years

### Your Control

You have **complete control** over your analytics data:

#### Check Status
```bash
npx create-errika analytics status
```

#### Enable Analytics
```bash
npx create-errika analytics enable
```

#### Disable Analytics
```bash
npx create-errika analytics disable
```

#### View Your Local Stats
```bash
npx create-errika stats
```

#### Remove All Data
```bash
npx create-errika analytics reset
```

This will completely remove:
- Your consent preferences
- All locally stored analytics data
- Your anonymous user ID

### Consent Management

- You will be prompted for consent **only once** when you first use Errika
- If you decline, we will ask again after 90 days (you can always decline)
- You can change your preference at any time using the commands above
- Analytics will **never** run without your explicit consent

### Data Security

- All data transmission uses HTTPS encryption
- No authentication or personal identifiers are required
- The anonymous User ID cannot be traced back to you
- We do not share, sell, or distribute your data to third parties

### Third-Party Services

If configured, Errika may send analytics data to:
- **Self-hosted analytics backend** (default: disabled)
- **Google Analytics** (optional, requires configuration)

You can verify the analytics endpoint by checking the `ERRIKA_ANALYTICS_ENDPOINT` environment variable.

### Children's Privacy

Errika does not knowingly collect data from children under 13. The analytics feature is designed for developers and requires explicit opt-in consent.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in this document with an updated "Last Updated" date.

## Contact

If you have questions or concerns about this privacy policy, please:

- Open an issue on GitHub: [https://github.com/yourusername/errika/issues](https://github.com/yourusername/errika/issues)
- Review the source code: [https://github.com/yourusername/errika](https://github.com/yourusername/errika)

## Open Source

Errika is open source. You can review the entire analytics implementation in the source code:
- `src/analytics/analytics.ts` - Analytics client
- `src/analytics/consent.ts` - Consent management
- `src/analytics/types.ts` - Data types and structures

## Your Rights

Depending on your jurisdiction, you may have rights including:
- The right to access your data
- The right to delete your data (use `npx create-errika analytics reset`)
- The right to opt-out (use `npx create-errika analytics disable`)
- The right to data portability (your data is stored locally in JSON format)

---

**Remember**: Analytics are completely optional and Errika works perfectly without them. Your privacy is our priority.

