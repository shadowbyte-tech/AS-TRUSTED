# 🕵️ Error Tracking & Observability (Sentry Setup)

To achieve a true 10/10 production rating, real-time error tracking via Sentry is required.

## 1. Installation

Install the Sentry Next.js SDK:
```bash
npm install @sentry/nextjs
```

## 2. Initialization

Run the Sentry Wizard to automatically configure the project:
```bash
npx @sentry/wizard@latest -i nextjs
```
*This will create `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.*

## 3. Environment Variables

Add these to your production provider (Vercel/Railway):
```env
SENTRY_AUTH_TOKEN=your_auth_token_from_sentry
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn@sentry.io/project_id
```

## 4. Integration with Logger

Update `src/lib/logger.ts` to forward errors to Sentry:

```typescript
import * as Sentry from "@sentry/nextjs";

// Inside Logger class...
error(message: string, data?: any) {
  this.log('error', message, data);
  
  if (this.isProduction) {
    Sentry.captureException(data instanceof Error ? data : new Error(message), {
      extra: data,
    });
  }
}
```

## 5. Benefits
- **Zero-Day Awareness**: Know exactly when a user hits a 500 error.
- **Traceability**: See the exact line of code and variable state for every crash.
- **Performance Monitoring**: Track slow API routes and DB queries.
