# 🔧 MongoDB Connection Fix Guide

**Issue:** MongoDB connection failing with `querySrv ECONNREFUSED`
**Status:** ❌ CRITICAL - App cannot function without database

---

## 🚨 IMMEDIATE FIXES REQUIRED

### 1. **MongoDB Atlas Network Access Configuration**

**Step 1: Access MongoDB Atlas**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in with your account
3. Select your project: `SMKG`
4. Navigate to **Network Access** in the left sidebar

**Step 2: Add IP Addresses**
1. Click **"+ ADD IP ADDRESS"**
2. For immediate testing, add: `0.0.0.0/0` (Allow access from anywhere)
   - **⚠️ WARNING:** This is less secure but needed for Netlify deployment
3. For production, add specific Netlify IP ranges:
   ```
   44.210.21.249/32
   52.5.4.14/32
   54.86.50.139/32
   ```

**Step 3: Verify Cluster Status**
1. Go to **Database** → **Clusters**
2. Ensure your cluster `SMKG` is **Active**
3. Click **Connect** → **Connect your application**
4. Copy the connection string

### 2. **Update Database Password**

**Current Issue:** Password might be incorrect or expired

**Fix Steps:**
1. In MongoDB Atlas, go to **Database Access**
2. Find user: `sukkamanikantagoud_db_user`
3. Click **Edit** → **Edit Password**
4. Generate a new strong password (save it securely)
5. Update your `.env` file with the new password

**New Connection String Format:**
```
MONGODB_URI='mongodb+srv://sukkamanikantagoud_db_user:[NEW_PASSWORD]@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG'
```

### 3. **Test Connection Locally**

**Create Test Script:** `scripts/test-mongodb-connection.js`
```javascript
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  console.log('🔄 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/:[^:@]*@/, ':****@')); // Hide password

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = client.db('astc_database');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write operation successful!');
    
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check MongoDB Atlas Network Access settings');
      console.log('2. Verify your IP address is whitelisted');
      console.log('3. Ensure cluster is running and accessible');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication issue:');
      console.log('1. Check username and password in connection string');
      console.log('2. Verify database user permissions');
    }
  } finally {
    await client.close();
  }
}

testConnection();
```

**Run Test:**
```bash
node scripts/test-mongodb-connection.js
```

### 4. **Environment Variables Setup**

**For Local Development (.env):**
```env
# DO NOT COMMIT THIS FILE
MONGODB_URI='mongodb+srv://sukkamanikantagoud_db_user:[NEW_PASSWORD]@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG'
JWT_SECRET='[GENERATE_NEW_64_CHAR_SECRET]'
GEMINI_API_KEY='[NEW_API_KEY]'
OWNER_WHATSAPP_NUMBER='919866404090'
NODE_ENV='development'
```

**For Netlify Production:**
1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add the same variables (without quotes)

### 5. **Generate New Secrets**

**JWT Secret Generation:**
```bash
# Run this command to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**API Key Rotation:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your Gemini API key
4. Delete the old key
5. Create a new API key
6. Restrict it to Gemini API only

---

## 🔒 SECURITY CHECKLIST

### Before Deployment:
- [ ] ✅ Remove `.env` from git history
- [ ] ✅ Generate new JWT secret (64+ characters)
- [ ] ✅ Rotate Gemini API key
- [ ] ✅ Update MongoDB password
- [ ] ✅ Configure MongoDB Network Access
- [ ] ✅ Test MongoDB connection locally
- [ ] ✅ Set environment variables in Netlify
- [ ] ✅ Test deployment

### Git History Cleanup:
```bash
# Remove .env from git history (CRITICAL)
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all

# Force push to remove from remote
git push origin --force --all

# Clean up local references
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

---

## 🚀 DEPLOYMENT STEPS

### 1. **Local Testing**
```bash
# Install dependencies
npm install

# Test MongoDB connection
npm run test:mongodb

# Test application locally
npm run dev
```

### 2. **Netlify Deployment**
```bash
# Build the application
npm run build

# Deploy to Netlify (if using CLI)
netlify deploy --prod
```

### 3. **Post-Deployment Verification**
1. Check Netlify function logs
2. Test user registration
3. Test plot creation
4. Verify database operations
5. Test authentication flow

---

## 🔍 TROUBLESHOOTING

### Common Issues:

**1. "querySrv ECONNREFUSED"**
- **Cause:** Network access not configured
- **Fix:** Add IP addresses to MongoDB Atlas Network Access

**2. "Authentication failed"**
- **Cause:** Wrong username/password
- **Fix:** Update database user credentials

**3. "MongoServerError: bad auth"**
- **Cause:** Database user doesn't exist or wrong permissions
- **Fix:** Recreate database user with proper permissions

**4. "Connection timeout"**
- **Cause:** Firewall or network issues
- **Fix:** Check network connectivity and MongoDB Atlas status

### MongoDB Atlas Checklist:
- [ ] Cluster is running (not paused)
- [ ] Network Access allows your IP
- [ ] Database user exists and has correct permissions
- [ ] Connection string is correct
- [ ] Password is URL-encoded if it contains special characters

### URL Encoding for Passwords:
If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

---

## 📞 NEXT STEPS

1. **Fix MongoDB connection** (30 minutes)
2. **Update all secrets** (15 minutes)
3. **Test locally** (15 minutes)
4. **Deploy to Netlify** (15 minutes)
5. **Verify production** (15 minutes)

**Total Time:** ~1.5 hours

**Priority:** CRITICAL - Must be fixed before any deployment