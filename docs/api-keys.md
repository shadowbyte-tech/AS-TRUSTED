# 🔑 Required API Keys Guide

To enable all features of the AS Trusted Consultancy platform, you need to configure the following API keys in your environment (`.env.local` or environment variables in Vercel/Railway).

## 1. Primary Databases (Required)
- `MONGODB_URI`: Your MongoDB connection string (Atlas or Railway).
- `JWT_SECRET`: A secure 32+ character string for auth tokens.
  - *Generate one*: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 2. AI Intelligence (At least one required)
Enabled for Buddy AI (Premium Real Estate Expert) and Buggy AI (Free Guide).
- `GROK_API_KEY`: xAI Grok (Primary high-performance engine).
- `DEEPSEEK_API_KEY`: DeepSeek (Secondary low-cost engine).
- `GEMINI_API_KEY`: Google Gemini (Tertiary high-compatibility engine).

## 3. Media & Emails (Highly Recommended)
- `CLOUDINARY_CLOUD_NAME`: For property image hosting.
- `CLOUDINARY_API_KEY`: For property image hosting.
- `CLOUDINARY_API_SECRET`: For property image hosting.
- `RESEND_API_KEY`: For automated email notifications (Site Visit requests, Inquiries).

## 4. Analytics & Error Tracking (Production Only)
- `NEXT_PUBLIC_SENTRY_DSN`: For real-time error tracking (see `docs/sentry-setup.md`).
- `SENTRY_AUTH_TOKEN`: For uploading source maps during build.

---

## Deployment Checklist
Check if these are set before running `npm run build`:
✅ `MONGODB_URI`
✅ `JWT_SECRET`
✅ `GROK_API_KEY` (or Gemini/DeepSeek)
✅ `NEXTAUTH_URL` (Set to your domain, e.g., `https://astrustedconsultancy.com`)
