# Analytics Feature Documentation

## Overview

Errika now includes an optional, privacy-focused analytics feature that helps us understand template usage patterns and improve the tool. This feature is **completely opt-in** and respects user privacy at every step.

## Architecture

### Module Structure

```
src/analytics/
├── types.ts       # TypeScript type definitions
├── consent.ts     # Consent management and configuration
├── analytics.ts   # Analytics client and tracking
└── index.ts       # Module exports
```

### Data Storage

All analytics data is stored locally on the user's machine:

- **Config file**: `~/.errika/config.json`
- **Analytics data**: `~/.errika/analytics.json`

### Data Flow

1. **First Run**: User is prompted for consent
2. **Tracking**: When a project is created, an event is logged (if consent given)
3. **Local Storage**: Event is saved to `~/.errika/analytics.json`
4. **Remote Transmission**: Event is sent to analytics backend (if configured)
5. **Statistics**: User can view their local stats anytime

## Implementation Details

### Consent Management

**File**: `src/analytics/consent.ts`

- **Consent Prompt**: Shows once on first use, then every 90 days if declined
- **Configuration**: Stored in `~/.errika/config.json`
- **Anonymous ID**: Random UUID generated for each user
- **Privacy-First**: Detailed information shown before asking

**Key Functions**:
- `requestConsent()` - Prompt user for consent
- `loadConfig()` - Load user configuration
- `saveConfig()` - Save user configuration
- `enableAnalytics()` - Enable tracking
- `disableAnalytics()` - Disable tracking
- `resetAnalytics()` - Remove all data

### Analytics Tracking

**File**: `src/analytics/analytics.ts`

- **Event Types**: `project_created`, `project_failed`
- **Local Storage**: All events saved locally
- **Event Limit**: Last 100 events kept
- **Remote Endpoint**: Configurable via `ERRIKA_ANALYTICS_ENDPOINT`

**Data Collected**:
```typescript
{
  eventType: 'project_created' | 'project_failed',
  template: string,           // e.g., "nextjs", "turborepo"
  success: boolean,
  timestamp: string,          // ISO 8601 format
  nodeVersion: string,        // e.g., "v18.17.0"
  packageManager?: string,    // e.g., "pnpm", "npm"
  errorType?: string         // Generic category, no sensitive data
}
```

**Key Functions**:
- `trackProjectCreation()` - Track a project creation event
- `getUsageStats()` - Get aggregated statistics
- `getRecentEvents()` - Get recent events
- `clearAnalyticsData()` - Clear all analytics data

### Integration Points

#### CLI Integration (`src/cli.ts`)

1. **Consent Prompt**: Added to main action before prompts
2. **Stats Command**: `npx create-errika stats`
3. **Analytics Commands**: 
   - `npx create-errika analytics enable`
   - `npx create-errika analytics disable`
   - `npx create-errika analytics status`
   - `npx create-errika analytics reset`

#### Generator Integration (`src/generators/baseGenerator.ts`)

- **Success Tracking**: Called after successful project generation
- **Failure Tracking**: Called in catch block with error categorization
- **Error Categories**: Generic types (e.g., "directory_not_empty", "package_manager_error")

## Usage Statistics Display

The `stats` command shows:

1. **Overall Stats**:
   - Total projects created
   - Successful vs failed
   - Success rate percentage
   - First and last use dates

2. **Template Usage**:
   - Bar chart showing usage by template
   - Sorted by popularity

3. **Recent Activity**:
   - Last 10 events
   - Template, status, and timestamp

4. **Analytics Status**:
   - Current enabled/disabled state
   - Commands to change settings

## Privacy Considerations

### What We DON'T Collect

- ❌ Project names or paths
- ❌ Personal information (name, email, IP)
- ❌ Code or file contents
- ❌ Environment variables
- ❌ Computer/system information (except Node version)
- ❌ Any personally identifiable information

### Error Handling

All analytics functions are wrapped in try-catch blocks:
- Analytics failures never break the user experience
- All errors fail silently
- Analytics is non-blocking

### Security Features

- **HTTPS Only**: Remote transmission uses HTTPS
- **Anonymous ID**: Cannot be traced to user identity
- **No Authentication**: No login or personal identifiers required
- **Local First**: All data stored locally, user controls it
- **Timeout**: Remote requests timeout after 3 seconds

## Configuration

### Environment Variables

- `ERRIKA_ANALYTICS_ENDPOINT`: Custom analytics backend URL
  - Default: `https://analytics.errika.dev/event`
  - Set to empty or "example.com" to disable remote transmission

### Backend Integration

The analytics client sends POST requests with JSON payload:

```typescript
{
  eventType: string,
  template: string,
  success: boolean,
  timestamp: string,
  nodeVersion: string,
  packageManager?: string,
  errorType?: string,
  userId: string,      // Anonymous UUID
  version: string      // CLI version
}
```

**Headers**:
```
Content-Type: application/json
User-Agent: Errika-CLI/2.0.0
```

## Testing

To test analytics locally:

```bash
# Enable analytics
npx create-errika analytics enable

# Create a project (triggers tracking)
npx create-errika

# View stats
npx create-errika stats

# Disable analytics
npx create-errika analytics disable

# Reset all data
npx create-errika analytics reset
```

## Future Enhancements

Potential improvements:

1. **Google Analytics Integration**: Optional GA4 tracking
2. **Offline Queue**: Queue events when offline, sync later
3. **More Metrics**: Template variant usage, generation time
4. **Dashboard**: Web dashboard for aggregated stats
5. **Export**: Export local data to CSV/JSON

## Compliance

### GDPR Compliance

- ✅ Right to access (data stored locally)
- ✅ Right to erasure (`analytics reset` command)
- ✅ Right to opt-out (default is opt-out)
- ✅ Data minimization (only essential data)
- ✅ Transparency (detailed privacy policy)

### CCPA Compliance

- ✅ Right to know (clear documentation)
- ✅ Right to delete (reset command)
- ✅ Right to opt-out (disabled by default)
- ✅ No sale of personal information

## Troubleshooting

### Analytics not working

1. Check if enabled: `npx create-errika analytics status`
2. Check file permissions: `~/.errika/` should be writable
3. Check backend endpoint: `echo $ERRIKA_ANALYTICS_ENDPOINT`

### Clear corrupted data

```bash
# Remove all analytics data
npx create-errika analytics reset

# Or manually delete
rm -rf ~/.errika/
```

### Disable completely

```bash
# Disable tracking
npx create-errika analytics disable

# Or set environment variable
export ERRIKA_ANALYTICS_ENDPOINT=""
```

## Monitoring

For maintainers monitoring analytics:

### Key Metrics to Track

1. **Opt-in Rate**: Percentage of users enabling analytics
2. **Template Popularity**: Usage distribution across templates
3. **Success Rate**: Percentage of successful generations
4. **Error Types**: Common failure patterns
5. **Node Version Distribution**: Understanding user environments

### Privacy Review Checklist

- [ ] No PII collected
- [ ] Consent properly requested
- [ ] Data minimization applied
- [ ] Opt-out mechanism working
- [ ] Local data deletion working
- [ ] Privacy policy up to date

## Resources

- **Privacy Policy**: [../PRIVACY.md](../PRIVACY.md)
- **Implementation**: [../src/analytics/](../src/analytics/)
- **Tests**: Coming soon in `src/__tests__/unit/analytics/`

---

**Note**: Analytics is designed to be helpful without being invasive. User privacy and trust are our top priorities.

