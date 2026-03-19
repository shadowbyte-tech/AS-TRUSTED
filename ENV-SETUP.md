# ─── REQUIRED ENVIRONMENT VARIABLES ─────────────────────────────────────
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database
# OR use local SQLite (default for development)
DATABASE_URL=file:./data/as-trusted.db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=https://your-domain.com

# ─── OPTIONAL ENVIRONMENT VARIABLES ─────────────────────────────────────
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@your-domain.com

# Development Settings
NODE_ENV=development
LOG_LEVEL=info

# ─── PRODUCTION SETTINGS ────────────────────────────────────────
# Set NODE_ENV=production for production builds
# Set NEXTAUTH_URL=https://astrustedconsultancy.com for production
