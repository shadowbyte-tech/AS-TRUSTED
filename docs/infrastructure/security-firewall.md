# Security Firewall & Monitoring
# CLOUDFLARE WAF + CUSTOM MONITORING

## Cloudflare WAF Configuration
# Already covered in cloudflare-setup.md

## Additional Security Middleware
# src/shared/middleware/security.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { logSecurityEvent } from '@/shared/utils/security-logger';

export class SecurityMiddleware {
  // IP Blocking
  private static blockedIPs = new Set<string>();
  private static suspiciousIPs = new Map<string, { count: number; lastSeen: number }>();
  
  // Rate limiting per IP
  private static rateLimits = new Map<string, { count: number; resetTime: number }>();
  
  // Suspicious patterns
  private static suspiciousPatterns = [
    /union\s+select/i,
    /exec\s*\(/i,
    /system\s*\(/i,
    /eval\s*\(/i,
    /base64_decode/i,
    /file_get_contents/i,
    /curl\s+/i,
    /wget\s+/i,
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /\.\.\//,
    /\/etc\/passwd/i,
    /\/proc\//i,
  ];
  
  static async checkRequest(request: NextRequest): Promise<NextResponse | null> {
    const clientIP = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);
    
    // 1. Check blocked IPs
    if (this.blockedIPs.has(clientIP)) {
      await logSecurityEvent('blocked_ip_access', {
        ip: clientIP,
        url: url.pathname,
        userAgent
      });
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // 2. Check suspicious IP activity
    const suspiciousData = this.suspiciousIPs.get(clientIP);
    if (suspiciousData && Date.now() - suspiciousData.lastSeen < 60000) {
      suspiciousData.count++;
      if (suspiciousData.count > 10) {
        this.blockedIPs.add(clientIP);
        await logSecurityEvent('ip_blocked_suspicious_activity', {
          ip: clientIP,
          count: suspiciousData.count,
          url: url.pathname
        });
        return new NextResponse('Forbidden', { status: 403 });
      }
    } else {
      this.suspiciousIPs.set(clientIP, { count: 1, lastSeen: Date.now() });
    }
    
    // 3. Check for SQL injection patterns
    const queryString = url.search + url.pathname;
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(queryString)) {
        await logSecurityEvent('sql_injection_attempt', {
          ip: clientIP,
          url: url.pathname,
          query: url.search,
          pattern: pattern.source,
          userAgent
        });
        return new NextResponse('Bad Request', { status: 400 });
      }
    }
    
    // 4. Check user agent
    if (this.isSuspiciousUserAgent(userAgent)) {
      await logSecurityEvent('suspicious_user_agent', {
        ip: clientIP,
        userAgent
      });
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // 5. Rate limiting
    if (!this.checkRateLimit(clientIP)) {
      await logSecurityEvent('rate_limit_exceeded', {
        ip: clientIP,
        url: url.pathname
      });
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    
    return null; // Allow request
  }
  
  private static getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for') ||
           request.headers.get('x-real-ip') ||
           request.ip ||
           'unknown';
  }
  
  private static isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousAgents = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http/i,
      /postman/i,
      /insomnia/i,
    ];
    
    return suspiciousAgents.some(pattern => pattern.test(userAgent));
  }
  
  private static checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;
    
    const record = this.rateLimits.get(ip);
    
    if (!record || now > record.resetTime) {
      this.rateLimits.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  // Clean up old records
  static cleanup(): void {
    const now = Date.now();
    
    // Clean up rate limits
    for (const [ip, record] of this.rateLimits.entries()) {
      if (now > record.resetTime) {
        this.rateLimits.delete(ip);
      }
    }
    
    // Clean up suspicious IPs
    for (const [ip, data] of this.suspiciousIPs.entries()) {
      if (now - data.lastSeen > 300000) { // 5 minutes
        this.suspiciousIPs.delete(ip);
      }
    }
  }
}

// Auto-cleanup every 5 minutes
setInterval(() => SecurityMiddleware.cleanup(), 300000);
```

## Security Logger
# src/shared/utils/security-logger.ts
```typescript
import { CacheService } from './redis';

interface SecurityEvent {
  type: string;
  timestamp: number;
  ip: string;
  userAgent?: string;
  url?: string;
  details: Record<string, any>;
}

export class SecurityLogger {
  static async logEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    // Log to Redis for real-time monitoring
    await CacheService.lpush('security:events', JSON.stringify(securityEvent));
    
    // Keep only last 1000 events
    const events = await CacheService.lrange('security:events', 0, 999);
    if (events.length > 1000) {
      await CacheService.ltrim('security:events', 0, 999);
    }
    
    // Log to console for development
    console.warn('🚨 Security Event:', securityEvent);
    
    // Store event type statistics
    await CacheService.hincrby('security:stats', event.type, 1);
    
    // Check for critical events
    if (this.isCriticalEvent(event.type)) {
      await this.handleCriticalEvent(securityEvent);
    }
  }
  
  private static isCriticalEvent(type: string): boolean {
    const criticalEvents = [
      'sql_injection_attempt',
      'blocked_ip_access',
      'ip_blocked_suspicious_activity',
      'authentication_bypass_attempt'
    ];
    
    return criticalEvents.includes(type);
  }
  
  private static async handleCriticalEvent(event: SecurityEvent): Promise<void> {
    // Store critical events for immediate review
    await CacheService.lpush('security:critical', JSON.stringify(event));
    
    // Keep only last 100 critical events
    const criticalEvents = await CacheService.lrange('security:critical', 0, 99);
    if (criticalEvents.length > 100) {
      await CacheService.ltrim('security:critical', 0, 99);
    }
    
    // In production, send alerts (email, Slack, etc.)
    if (process.env.NODE_ENV === 'production') {
      await this.sendSecurityAlert(event);
    }
  }
  
  private static async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    // Implement alert system (email, webhook, etc.)
    console.error('🚨 CRITICAL SECURITY ALERT:', event);
    
    // Add to alert queue for processing
    await CacheService.lpush('security:alerts', JSON.stringify({
      ...event,
      alertLevel: 'critical',
      timestamp: new Date().toISOString()
    }));
  }
  
  // Get security statistics
  static async getSecurityStats(): Promise<{
    totalEvents: number;
    criticalEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: SecurityEvent[];
    criticalAlerts: any[];
  }> {
    // Get total events count
    const events = await CacheService.lrange('security:events', 0, -1);
    const criticalEvents = await CacheService.lrange('security:critical', 0, -1);
    const alerts = await CacheService.lrange('security:alerts', 0, -1);
    
    // Get events by type
    const stats = await CacheService.hgetall('security:stats');
    const eventsByType: Record<string, number> = {};
    
    if (stats) {
      for (const [type, count] of Object.entries(stats)) {
        eventsByType[type] = parseInt(count as string) || 0;
      }
    }
    
    // Get recent events (last 50)
    const recentEvents = events
      .slice(-50)
      .map(event => JSON.parse(event));
    
    const criticalAlerts = alerts
      .slice(-20)
      .map(alert => JSON.parse(alert));
    
    return {
      totalEvents: events.length,
      criticalEvents: criticalEvents.length,
      eventsByType,
      recentEvents,
      criticalAlerts
    };
  }
  
  // Clear old events
  static async clearOldEvents(daysOld: number = 7): Promise<void> {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    
    const events = await CacheService.lrange('security:events', 0, -1);
    const validEvents = events.filter(event => {
      const parsedEvent = JSON.parse(event);
      return parsedEvent.timestamp > cutoffTime;
    });
    
    // Update events list
    await CacheService.del('security:events');
    for (const event of validEvents) {
      await CacheService.lpush('security:events', event);
    }
  }
}

// Export for use in middleware
export const logSecurityEvent = SecurityLogger.logEvent;
```

## Security Dashboard API
# src/services/security-service/routes/security.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SecurityLogger } from '@/shared/utils/security-logger';
import { CacheService } from '@/shared/utils/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    switch (type) {
      case 'stats':
        const stats = await SecurityLogger.getSecurityStats();
        return NextResponse.json(stats);
        
      case 'events':
        const limit = parseInt(searchParams.get('limit') || '50');
        const events = await CacheService.lrange('security:events', 0, limit - 1);
        return NextResponse.json({
          events: events.map(event => JSON.parse(event)),
          total: events.length
        });
        
      case 'alerts':
        const alerts = await CacheService.lrange('security:alerts', 0, 19);
        return NextResponse.json({
          alerts: alerts.map(alert => JSON.parse(alert)),
          total: alerts.length
        });
        
      case 'blocked-ips':
        // This would need to be stored in a persistent way
        return NextResponse.json({ blockedIPs: [] });
        
      default:
        return NextResponse.json({ error: 'Invalid security endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Security API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();
    
    switch (action) {
      case 'block-ip':
        // Implement IP blocking logic
        return NextResponse.json({ success: true, message: 'IP blocked' });
        
      case 'unblock-ip':
        // Implement IP unblocking logic
        return NextResponse.json({ success: true, message: 'IP unblocked' });
        
      case 'clear-events':
        await SecurityLogger.clearOldEvents(data.daysOld || 7);
        return NextResponse.json({ success: true, message: 'Events cleared' });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Security API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Security Dashboard Component
# src/components/security-dashboard.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Ban,
  RefreshCw
} from 'lucide-react';

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  eventsByType: Record<string, number>;
  recentEvents: any[];
  criticalAlerts: any[];
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSecurityStats();
    const interval = setInterval(fetchSecurityStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const fetchSecurityStats = async () => {
    try {
      const response = await fetch('/api/security?type=stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch security stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="text-center text-muted-foreground">
        Failed to load security data
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalEvents}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Currently blocked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.eventsByType['sql_injection_attempt'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">SQL injection attempts</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentEvents.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{event.type.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-muted-foreground">
                    IP: {event.ip} • {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
                <Badge variant={event.type.includes('critical') ? 'destructive' : 'secondary'}>
                  {event.type.includes('critical') ? 'Critical' : 'Warning'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Critical Alerts */}
      {stats.criticalAlerts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Critical Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.criticalAlerts.map((alert, index) => (
                <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <div className="font-medium text-destructive">{alert.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {alert.details?.message || 'Critical security event detected'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## Security Monitoring Script
# scripts/security-monitor.js
```javascript
const { SecurityLogger } = require('./src/shared/utils/security-logger');

async function securityMonitor() {
  console.log('🔒 Starting Security Monitor...');
  
  // Check for critical events
  const stats = await SecurityLogger.getSecurityStats();
  
  if (stats.criticalEvents > 0) {
    console.log(`🚨 ${stats.criticalEvents} critical security events detected!`);
    
    // Send alert to admin (implement your alert system)
    await sendAdminAlert({
      type: 'security',
      message: `${stats.criticalEvents} critical security events detected`,
      stats
    });
  }
  
  // Check for unusual patterns
  const sqlAttempts = stats.eventsByType['sql_injection_attempt'] || 0;
  if (sqlAttempts > 10) {
    console.log(`🚨 High number of SQL injection attempts: ${sqlAttempts}`);
    await sendAdminAlert({
      type: 'sql_injection',
      message: `High number of SQL injection attempts: ${sqlAttempts}`,
      count: sqlAttempts
    });
  }
  
  console.log('✅ Security monitor check completed');
}

async function sendAdminAlert(alert) {
  // Implement your alert system (email, Slack, webhook, etc.)
  console.log('📧 Admin Alert:', alert);
}

// Run every 5 minutes
setInterval(securityMonitor, 300000);

// Initial run
securityMonitor();
```

## Environment Variables
```env
# Security Configuration
SECURITY_MONITORING_ENABLED=true
SECURITY_ALERT_EMAIL=admin@astrustedconsultancy.com
SECURITY_WEBHOOK_URL=https://hooks.slack.com/your-webhook
SECURITY_RATE_LIMIT_REQUESTS=100
SECURITY_RATE_LIMIT_WINDOW=60000
```

## Security Headers Enhancement
# Add to next.config.js or middleware
```typescript
import { NextResponse } from 'next/server';

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP headers
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));
  
  return response;
}
```
