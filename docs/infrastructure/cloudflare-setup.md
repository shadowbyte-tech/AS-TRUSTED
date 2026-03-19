# Cloudflare CDN + WAF Configuration
# FREE PLAN IMPLEMENTATION

## 1. Domain Setup
1. Sign up for Cloudflare Free Plan
2. Add your domain: astrustedconsultancy.com
3. Update nameservers to Cloudflare

## 2. DNS Records
```
Type    Name              Content                    TTL     Proxy
A       @                 76.76.21.21 (Vercel)     Auto    ☑️
A       api               YOUR_VPS_IP               Auto    ☑️
CNAME   www               astrustedconsultancy.com     Auto    ☑️
```

## 3. SSL/TLS Settings
- SSL/TLS → Full (Strict)
- Always Use HTTPS: ON
- HSTS: Enable with max-age=63072000

## 4. Caching Configuration
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Edge Cache TTL: 7 days
- Development Mode: OFF (production)

## 5. Performance Optimization
- Auto Minify: HTML, CSS, JavaScript
- Brotli: ON
- Early Hints: ON
- HTTP/3 (with QUIC): ON

## 6. Security Settings (WAF)
- Bot Fight Mode: ON
- Security Level: Medium
- Challenge Passage: 5 minutes
- Rate Limiting: Custom rules

## 7. WAF Rules (Free Plan)
```
Rule 1: Block SQL Injection
Expression: (http.request.uri contains "SELECT" or "INSERT" or "UPDATE" or "DELETE") and (http.request.uri contains "'" or '"' or "or" or "and")
Action: Block
Status: ON

Rule 2: Rate Limit Login
Expression: (http.request.uri.path contains "/api/auth/login")
Action: Rate Limit (5 requests per minute)
Status: ON

Rule 3: Block Suspicious User Agents
Expression: (cf.bot_management.score lt 30)
Action: Challenge
Status: ON
```

## 8. Page Rules (FREE)
```
Rule 1: Cache Static Assets
If URL matches: *.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2)
Settings: Cache Level: Everything, Edge Cache TTL: 1 month

Rule 2: API No Cache
If URL matches: /api/*
Settings: Cache Level: Bypass

Rule 3: Redirect to HTTPS
If URL matches: http://*
Settings: Forwarding URL: https://$host$1
```

## 9. Analytics
- Web Analytics: ON
- Bot Analytics: ON
- Security Events: ON

## 10. DDoS Protection
- HTTP DDoS Protection: ON
- Advanced DDoS Protection: Automatic

## Verification Commands
```bash
# Test SSL
curl -I https://astrustedconsultancy.com

# Test Caching
curl -I -H "Cache-Control: no-cache" https://astrustedconsultancy.com/static/image.jpg

# Test WAF
curl -X POST https://astrustedconsultancy.com/api/auth/login -d "email=test' OR '1'='1"
```
