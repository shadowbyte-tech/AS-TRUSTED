# 🛡️ Production Backup & Recovery Strategy

This document outlines the strategy for ensuring data durability and recovery for the AS Trusted Consultancy platform.

## 1. MongoDB Atlas Backups (Recommended)

Since the project uses MongoDB Atlas (via Railway/Atlas), the primary backup mechanism should be **Cloud Backups**.

### Configuration
1. Log in to [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Navigate to **Deployment** -> **Database**.
3. Select your Cluster -> **Backup**.
4. **Enable Cloud Backups**:
   - **Retention**: At least 7 days of daily snapshots.
   - **Point-in-Time Recovery (PITR)**: Enable for mission-critical production clusters (allows 1-second granularity recovery).

---

## 2. Manual Backup Script (Cold Backup)

For additional safety, run a weekly manual dump to a secure off-site location (e.g., AWS S3 or a local encrypted drive).

### Script: `scripts/backup-db.sh`
```bash
#!/bin/bash
# MongoDB Backup Script
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/$TIMESTAMP"
MONGODB_URI="your_mongodb_uri_here"

echo "🚀 Starting MongoDB backup to $BACKUP_DIR..."
mkdir -p $BACKUP_DIR

# Use mongodump (requires MongoDB Database Tools installed)
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR"

if [ $? -eq 0 ]; then
  echo "✅ Backup successful!"
  # Optional: Compress
  tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
  rm -rf "$BACKUP_DIR"
else
  echo "❌ Backup failed!"
  exit 1
fi
```

### Automation
Add a cron job to run this script every Sunday at 3 AM:
`0 3 * * 0 /path/to/project/scripts/backup-db.sh`

---

## 3. Disaster Recovery (DR) Procedure

In the event of data loss:
1. **Assessment**: Identify the time of corruption/loss.
2. **SOP**:
   - Stop all state-changing API traffic (Maintenance Mode).
   - Go to MongoDB Atlas -> **Backup** -> **Restore**.
   - Select the latest healthy snapshot.
   - Restore to a **New Cluster** (highly recommended) or the existing one.
   - Update `MONGODB_URI` in Vercel/Railway if a new cluster was used.
   - Run verification tests.
   - Resume traffic.

---

## 4. JSON Fallback Data
The `data/*.json` files are for **development only**. Do not rely on them for production data. Ensure `NODE_ENV=production` is set to enforce MongoDB usage.
