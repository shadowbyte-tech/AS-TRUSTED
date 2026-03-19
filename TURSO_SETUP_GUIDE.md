# Turso Database Setup Guide

## ✅ Setup Complete - Next Steps Required

### 📋 What's Been Done:
- ✅ Turso CLI installed globally
- ✅ Database connection file created (`src/lib/db.ts`)
- ✅ API routes created for all endpoints
- ✅ Admin dashboard created
- ✅ Database schema file created (`schema.sql`)
- ✅ Environment template created

### 🔧 Manual Steps Required:

#### Step 1: Create Turso Account & Database
1. **Sign up**: Go to [https://turso.tech](https://turso.tech) and create an account
2. **Create Database**: 
   ```bash
   # After login, run:
   C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd db create as-trusted-db
   ```
3. **Get Database URL**:
   ```bash
   C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd db show as-trusted-db
   ```
4. **Create Token**:
   ```bash
   C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd db tokens create as-trusted-db
   ```

#### Step 2: Configure Environment Variables
Create `.env.local` file in project root:
```env
# Replace with your actual values
TURSO_DATABASE_URL=libsql://as-trusted-db-xxxxx.turso.io
TURSO_AUTH_TOKEN=your-actual-token-here
ADMIN_SECRET=your-strong-admin-password
```

#### Step 3: Initialize Database Schema
```bash
# Apply the schema to your database
C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd db shell as-trusted-db < schema.sql
```

#### Step 4: Install Dependencies
```bash
npm install @libsql/client
```

#### Step 5: Update Existing Actions
Update your existing actions in `src/lib/actions.ts` to use the new database:
- Replace MongoDB calls with Turso calls
- Update import statements
- Test all CRUD operations

### 🗂 Files Created:
- `src/lib/db.ts` - Database connection and schema
- `src/app/api/plots/route.ts` - Plots API
- `src/app/api/plots/[id]/route.ts` - Plot details API
- `src/app/api/users/route.ts` - Users API
- `src/app/api/inquiries/route.ts` - Inquiries API
- `src/app/api/site-visits/route.ts` - Site visits API
- `src/app/admin/page.tsx` - Admin dashboard
- `schema.sql` - Database schema
- `setup-turso.ps1` - PowerShell setup script

### 🚀 Next Steps:
1. **Complete Turso Setup**: Follow manual steps above
2. **Test Database**: Verify all API endpoints work
3. **Update Actions**: Modify existing server actions
4. **Deploy**: Push to production with Turso connection

### 📞 Support:
- **Turso Docs**: https://turso.tech/docs
- **Database URL**: Will look like `libsql://as-trusted-db-abc123.turso.io`
- **Token Format**: Will be provided after token creation

### 🔍 Verification:
After setup, test these endpoints:
- `GET /api/plots` - Should return plots array
- `GET /api/users` - Should return users array
- `GET /api/admin` - Should show admin dashboard
- `POST /api/site-visits` - Should create site visit

### 🎯 Benefits of Turso:
- **Edge Database**: Global distribution for fast access
- **SQLite Compatible**: Easy migration from existing code
- **Serverless**: No server management required
- **Free Tier**: Generous free quota for development
- **Real-time**: Live data synchronization

**Your Turso database infrastructure is ready to go!**
