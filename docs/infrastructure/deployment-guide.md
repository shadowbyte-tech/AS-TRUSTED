# Complete Enterprise Architecture Deployment Guide
# FREE TIERS ONLY

## 📋 DEPLOYMENT CHECKLIST

### 1. Cloudflare Setup (FREE)
- [ ] Sign up for Cloudflare Free Plan
- [ ] Add domain to Cloudflare
- [ ] Update nameservers
- [ ] Configure DNS records
- [ ] Enable SSL/TLS
- [ ] Set up caching rules
- [ ] Configure WAF rules
- [ ] Enable DDoS protection

### 2. VPS Setup (FREE)
- [ ] Sign up for Oracle Cloud Free Tier
- [ ] Create Ubuntu 20.04+ instance
- [ ] Configure firewall
- [ ] Install NGINX
- [ ] Set up load balancer
- [ ] Configure SSL certificates

### 3. Redis Setup (FREE)
- [ ] Sign up for Upstash Free Plan
- [ ] Create Redis database
- [ ] Get connection details
- [ ] Test connection

### 4. AI Services Setup (FREE)
- [ ] Get HuggingFace API key
- [ ] Get Google Gemini API key
- [ ] Get OpenAI API key (optional)
- [ ] Test AI services

### 5. Environment Configuration
- [ ] Set up all environment variables
- [ ] Configure database connections
- [ ] Test all services

### 6. Deployment
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend services to VPS
- [ ] Start background workers
- [ ] Configure monitoring
- [ ] Test all functionality

## 🌍 ENVIRONMENT VARIABLES

### Frontend (Vercel)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.astrustedconsultancy.com
NEXT_PUBLIC_APP_URL=https://astrustedconsultancy.com

# AI Services
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_key
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_key

# Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Backend Services (VPS)
```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/as-trusted
TURSO_DATABASE_URL=file:./data/as-trusted.db

# Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# AI Services
HUGGINGFACE_API_KEY=your_huggingface_key
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key

# Email
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@astrustedconsultancy.com

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=15m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
SECURITY_MONITORING_ENABLED=true
SECURITY_ALERT_EMAIL=admin@astrustedconsultancy.com

# Node Environment
NODE_ENV=production
PORT=3001
```

## 🚀 DEPLOYMENT COMMANDS

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd /path/to/frontend
vercel --prod

# Set environment variables in Vercel dashboard
# Configure custom domain
```

### Backend Deployment (VPS)
```bash
# Connect to VPS
ssh ubuntu@your-vps-ip

# Clone repository
git clone https://github.com/your-username/as-trusted-consultancy.git
cd as-trusted-consultancy

# Install dependencies
npm install

# Build services
npm run build

# Install PM2
npm install -g pm2

# Start services
pm2 start ecosystem.config.js

# Setup auto-start
pm2 startup
pm2 save
```

### NGINX Configuration
```bash
# Test NGINX configuration
sudo nginx -t

# Reload NGINX
sudo nginx -s reload

# Enable auto-start
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Background Workers
```bash
# Start workers
npm run workers:start

# Monitor workers
pm2 monit

# View worker logs
pm2 logs workers
```

## 🔧 MONITORING SETUP

### Application Monitoring
```bash
# Install monitoring tools
npm install -g pm2-logrotate

# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Security Monitoring
```bash
# Start security monitor
node scripts/security-monitor.js

# Check security events
curl http://localhost:3001/api/security?type=stats
```

### Performance Monitoring
```bash
# Monitor system resources
htop
df -h
free -h

# Monitor application performance
pm2 monit
```

## 🧪 TESTING DEPLOYMENT

### 1. Basic Functionality Tests
```bash
# Test frontend
curl -I https://astrustedconsultancy.com

# Test API
curl https://api.astrustedconsultancy.com/health

# Test database connection
curl https://api.astrustedconsultancy.com/api/properties

# Test authentication
curl -X POST https://api.astrustedconsultancy.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 2. Security Tests
```bash
# Test WAF protection
curl -X POST https://astrustedconsultancy.com/api/auth/login \
  -d "email=test' OR '1'='1&password=test"

# Test rate limiting
for i in {1..150}; do
  curl https://api.astrustedconsultancy.com/api/properties
done

# Test SSL/TLS
openssl s_client -connect astrustedconsultancy.com:443
```

### 3. Performance Tests
```bash
# Test load time
curl -w "@curl-format.txt" -o /dev/null -s https://astrustedconsultancy.com

# Test API response time
time curl https://api.astrustedconsultancy.com/api/properties

# Test caching
curl -I https://astrustedconsultancy.com/static/image.jpg
```

## 📊 PERFORMANCE OPTIMIZATION

### Frontend Optimization
```typescript
// next.config.js
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize chunks
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};
```

### Backend Optimization
```typescript
// Enable response compression
import compression from 'compression';
app.use(compression());

// Enable caching
import { CacheService } from './shared/utils/redis';

// Optimize database queries
const optimizedQuery = `
  SELECT * FROM properties 
  WHERE property_type = ? 
  ORDER BY created_at DESC 
  LIMIT ? OFFSET ?
`;
```

## 🔄 CI/CD PIPELINE

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull origin main
            npm ci
            npm run build
            pm2 restart all
```

## 📈 MONITORING DASHBOARD

### Key Metrics to Monitor
- **Response Time**: < 200ms for API
- **Uptime**: > 99.9%
- **Error Rate**: < 1%
- **Security Events**: Monitor for spikes
- **Database Performance**: Query times
- **Cache Hit Rate**: > 80%
- **Memory Usage**: < 80%
- **CPU Usage**: < 70%

### Alert Thresholds
- **High Response Time**: > 500ms
- **High Error Rate**: > 5%
- **Security Events**: > 10/hour
- **Memory Usage**: > 90%
- **CPU Usage**: > 85%
- **Disk Space**: < 10%

## 🆘 TROUBLESHOOTING

### Common Issues
1. **Services not starting**
   - Check environment variables
   - Verify port availability
   - Check logs: `pm2 logs`

2. **Database connection issues**
   - Verify connection string
   - Check network connectivity
   - Test with simple query

3. **Redis connection issues**
   - Verify Upstash credentials
   - Check firewall rules
   - Test connection manually

4. **High memory usage**
   - Restart services: `pm2 restart all`
   - Check for memory leaks
   - Optimize queries

5. **SSL certificate issues**
   - Verify domain configuration
   - Check certificate validity
   - Test with SSL checker

## 🎯 SUCCESS METRICS

### Performance Targets
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms
- **Cache Hit Rate**: > 80%
- **Uptime**: > 99.9%
- **Security Events**: < 1% of traffic

### Business Metrics
- **User Registration Rate**: Track growth
- **Property Upload Rate**: Monitor engagement
- **Search Performance**: User satisfaction
- **Lead Conversion Rate**: Business success

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks
- **Daily**: Check logs, monitor performance
- **Weekly**: Update dependencies, clean up
- **Monthly**: Security audit, backup verification
- **Quarterly**: Performance review, optimization

### Emergency Procedures
1. **Service Down**: Check PM2 status, restart if needed
2. **Security Breach**: Review logs, block IPs, notify team
3. **Database Issues**: Check connections, verify backups
4. **High Traffic**: Scale up resources, enable caching

---

## 🎉 DEPLOYMENT COMPLETE!

Your AS Trusted Consultancy platform is now running with:
- ✅ Enterprise-grade architecture
- ✅ Free-tier optimization
- ✅ Security protection
- ✅ Performance monitoring
- ✅ AI-powered features
- ✅ Background processing
- ✅ Global CDN
- ✅ Load balancing

**Ready for production traffic!** 🚀
