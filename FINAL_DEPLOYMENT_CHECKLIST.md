# ✅ FINAL DEPLOYMENT CHECKLIST

**AS Trusted Consultancy - Production Deployment**
**Date:** March 16, 2026
**Current Status:** ⚠️ NEEDS CRITICAL FIXES

---

## 🚨 CRITICAL FIXES (MUST COMPLETE FIRST)

### 1. Security Vulnerabilities ❌
- [ ] **Remove `.env` from git history** (CRITICAL)
- [ ] **Generate new JWT secret** (64+ characters)
- [ ] **Rotate Gemini API key** 
- [ ] **Update MongoDB password**
- [ ] **Fix MongoDB network access**
- [ ] **Test MongoDB connection**

### 2. Dependencies ⚠️
- [ ] **Update vulnerable packages** (`npm audit fix`)
- [ ] **Install security dependencies** (`isomorphic-dompurify`)
- [ ] **Verify no critical vulnerabilities remain**

### 3. Security Implementation ✅
- [x] **Add security headers** (next.config.js)
- [x] **Create rate limiting middleware**
- [x] **Implement input sanitization**
- [x] **Add file validation**
- [ ] **Apply to all API routes**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Environment Setup
- [ ] **Local `.env` file updated with new secrets**
- [ ] **Netlify environment variables configured**
- [ ] **All sensitive data removed from code**
- [ ] **Git history cleaned of credentials**

### Database Configuration
- [ ] **MongoDB Atlas network access configured**
- [ ] **Database user password updated**
- [ ] **Connection string tested locally**
- [ ] **Database operations verified**

### Application Testing
- [ ] **Local development server runs without errors**
- [ ] **All pages load correctly**
- [ ] **User registration works**
- [ ] **User login works**
- [ ] **Plot creation works**
- [ ] **File uploads work**
- [ ] **Dashboard functions properly**

### Security Testing
- [ ] **Rate limiting tested on login**
- [ ] **Input sanitization verified**
- [ ] **File upload validation works**
- [ ] **Security headers present**
- [ ] **No sensitive data in client-side code**

### Build & Deploy
- [ ] **Production build succeeds** (`npm run build`)
- [ ] **No build errors or warnings**
- [ ] **Static files generated correctly**
- [ ] **Netlify deployment successful**

---

## 🔧 STEP-BY-STEP EXECUTION

### Phase 1: Critical Security (60 minutes)

**Step 1: Clean Git History (15 min)**
```bash
# Remove .env from git history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
```

**Step 2: Generate New Secrets (10 min)**
```bash
# Generate JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# Update .env with new values (DO NOT COMMIT)
```

**Step 3: Fix MongoDB (20 min)**
1. Go to MongoDB Atlas
2. Add IP addresses to Network Access: `0.0.0.0/0`
3. Update database user password
4. Test connection: `npm run test:mongodb`

**Step 4: Update Dependencies (15 min)**
```bash
npm audit fix
npm install isomorphic-dompurify
```

### Phase 2: Application Security (45 minutes)

**Step 5: Apply Security to Routes (30 min)**
- Update all API routes with rate limiting
- Add input sanitization to all user inputs
- Implement file validation

**Step 6: Test Security Features (15 min)**
- Test rate limiting on login
- Verify input sanitization
- Check file upload validation

### Phase 3: Deployment (30 minutes)

**Step 7: Local Testing (15 min)**
```bash
npm run dev
# Test all features manually
```

**Step 8: Production Build (10 min)**
```bash
npm run build
# Verify no errors
```

**Step 9: Deploy to Netlify (5 min)**
1. Set environment variables in Netlify
2. Deploy from GitHub
3. Verify deployment success

---

## 🎯 ENVIRONMENT VARIABLES FOR NETLIFY

**Required Variables:**
```
MONGODB_URI=mongodb+srv://sukkamanikantagoud_db_user:[NEW_PASSWORD]@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG
JWT_SECRET=[64_CHAR_HEX_STRING]
GEMINI_API_KEY=[NEW_API_KEY]
OWNER_WHATSAPP_NUMBER=919866404090
NODE_ENV=production
```

**How to Add in Netlify:**
1. Go to Netlify Dashboard
2. Select your site
3. Site settings → Environment variables
4. Add each variable (without quotes)

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### Functional Testing
- [ ] **Homepage loads correctly**
- [ ] **Plot listing page works**
- [ ] **User registration successful**
- [ ] **User login successful**
- [ ] **Owner login successful**
- [ ] **Plot creation works**
- [ ] **File uploads work**
- [ ] **Dashboard accessible**
- [ ] **Database operations successful**

### Security Testing
- [ ] **Rate limiting active** (try multiple login attempts)
- [ ] **Security headers present** (check browser dev tools)
- [ ] **No sensitive data exposed** (check network tab)
- [ ] **File upload restrictions work**
- [ ] **Input sanitization active**

### Performance Testing
- [ ] **Page load times acceptable** (<3 seconds)
- [ ] **Images load properly**
- [ ] **Mobile responsive**
- [ ] **No console errors**

---

## 🚨 ROLLBACK PLAN

**If Deployment Fails:**
1. **Revert to previous Netlify deployment**
2. **Check Netlify function logs for errors**
3. **Verify environment variables are set**
4. **Test MongoDB connection from Netlify**
5. **Check for build errors**

**Emergency Contacts:**
- MongoDB Atlas Support
- Netlify Support
- Google Cloud Support (for API issues)

---

## 📊 DEPLOYMENT READINESS SCORE

| Category | Status | Score |
|----------|--------|-------|
| **Security** | ❌ Critical Issues | 3/10 |
| **Database** | ❌ Connection Failed | 2/10 |
| **Dependencies** | ⚠️ Vulnerabilities | 5/10 |
| **Application** | ✅ Functional | 8/10 |
| **Build Process** | ✅ Working | 9/10 |

**Overall Readiness:** 27/50 (54%) - ❌ NOT READY

**Minimum Required:** 40/50 (80%) - ✅ READY TO DEPLOY

---

## 🎯 SUCCESS CRITERIA

**Deployment is successful when:**
- [ ] All critical security issues resolved
- [ ] MongoDB connection working
- [ ] All features functional in production
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] User can register and login
- [ ] Owner can manage plots
- [ ] No console errors

**Estimated Time to Ready:** 2-3 hours
**Priority:** Complete security fixes first, then deploy

---

**⚠️ DO NOT DEPLOY UNTIL ALL CRITICAL ITEMS ARE CHECKED ✅**