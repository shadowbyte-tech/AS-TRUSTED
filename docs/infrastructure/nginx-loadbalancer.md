# NGINX Load Balancer Configuration
# FREE VPS DEPLOYMENT

## Prerequisites
- Free VPS (Oracle Cloud Free Tier / AWS EC2 Free Tier)
- Ubuntu 20.04+ or CentOS 8+

## Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

## Main NGINX Configuration
# /etc/nginx/nginx.conf
```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream Backend Servers
    upstream api_backend {
        least_conn;
        server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
        server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
        server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Include site configs
    include /etc/nginx/conf.d/*.conf;
}
```

## Site Configuration
# /etc/nginx/conf.d/astrusted.conf
```nginx
server {
    listen 80;
    server_name api.astrustedconsultancy.com;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CORS for API
    add_header 'Access-Control-Allow-Origin' 'https://astrustedconsultancy.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://astrustedconsultancy.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    # API Routes with Rate Limiting
    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health Check Endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Block common attacks
    location ~* \.(aspx|php|jsp|cgi)$ {
        deny all;
    }

    location ~* \.(exe|php|jsp|asp|sh|py|pl|rb)$ {
        deny all;
    }
}
```

## Health Check Script
# /usr/local/bin/check-api-health.sh
```bash
#!/bin/bash
# Health check for API servers

servers=("127.0.0.1:3001" "127.0.0.1:3002" "127.0.0.1:3003")

for server in "${servers[@]}"; do
    if curl -f -s http://$server/health > /dev/null; then
        echo "✅ $server is healthy"
    else
        echo "❌ $server is down"
        # Restart server (implement your restart logic)
        # pm2 restart api-server-${server##*:}
    fi
done
```

## Deployment Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo nginx -s reload

# Enable auto-start
sudo systemctl enable nginx
sudo systemctl start nginx

# Setup log rotation
sudo nano /etc/logrotate.d/nginx
```

## Monitoring
```bash
# Real-time monitoring
sudo tail -f /var/log/nginx/access.log

# Error monitoring
sudo tail -f /var/log/nginx/error.log

# Connection stats
sudo ss -tuln | grep :80
sudo ss -tuln | grep :443
```
