# Microservices Architecture
# FREE TIER DEPLOYMENT

## Folder Structure
```
src/
├── services/
│   ├── auth-service/
│   │   ├── routes/
│   │   │   ├── login.ts
│   │   │   ├── register.ts
│   │   │   ├── refresh.ts
│   │   │   └── logout.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   └── models/
│   │       └── user.model.ts
│   ├── property-service/
│   │   ├── routes/
│   │   │   ├── properties.ts
│   │   │   ├── plots.ts
│   │   │   ├── houses.ts
│   │   │   └── lands.ts
│   │   ├── controllers/
│   │   │   └── property.controller.ts
│   │   ├── models/
│   │   │   └── property.model.ts
│   │   └── middleware/
│   │       └── validation.ts
│   ├── image-service/
│   │   ├── routes/
│   │   │   ├── upload.ts
│   │   │   └── delete.ts
│   │   ├── controllers/
│   │   │   └── image.controller.ts
│   │   └── middleware/
│   │       └── auth.ts
│   ├── search-service/
│   │   ├── routes/
│   │   │   └── search.ts
│   │   ├── controllers/
│   │   │   └── search.controller.ts
│   │   └── middleware/
│   │       └── cache.ts
│   └── analytics-service/
│       ├── routes/
│       │   ├── events.ts
│       │   └── metrics.ts
│       ├── controllers/
│       │   └── analytics.controller.ts
│       └── middleware/
│           └── auth.ts
├── shared/
│   ├── middleware/
│   │   ├── cors.ts
│   │   ├── rate-limit.ts
│   │   └── logging.ts
│   ├── utils/
│   │   ├── redis.ts
│   │   ├── database.ts
│   │   └── logger.ts
│   └── types/
│       ├── common.types.ts
│       └── api.types.ts
└── gateway/
    ├── api/
    │   └── routes/
    │       ├── auth.ts
    │       ├── properties.ts
    │       ├── images.ts
    │       └── search.ts
    └── middleware/
        ├── gateway.ts
        └── load-balancer.ts
```

## Service Gateway
# src/gateway/api/routes/auth.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { forwardToService } from '@/shared/utils/service-communication';

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  
  if (pathname.includes('/login')) {
    return forwardToService('auth-service', request);
  }
  
  if (pathname.includes('/register')) {
    return forwardToService('auth-service', request);
  }
  
  return NextResponse.json({ error: 'Route not found' }, { status: 404 });
}
```

## Service Communication
# src/shared/utils/service-communication.ts
```typescript
import { NextRequest } from 'next/server';

const SERVICE_PORTS = {
  'auth-service': 3001,
  'property-service': 3002,
  'image-service': 3003,
  'search-service': 3004,
  'analytics-service': 3005,
};

export async function forwardToService(
  serviceName: keyof typeof SERVICE_PORTS,
  request: NextRequest
): Promise<Response> {
  const port = SERVICE_PORTS[serviceName];
  const url = new URL(request.url);
  
  // Rewrite URL to target service
  const serviceUrl = `http://localhost:${port}${url.pathname}${url.search}`;
  
  const response = await fetch(serviceUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  return response;
}
```

## Auth Service
# src/services/auth-service/controllers/auth.controller.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, registerUser } from '@/shared/utils/auth';
import { validateInput } from '@/shared/utils/validation';
import { logEvent } from '@/shared/utils/logger';

export class AuthController {
  static async login(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Validate input
      const validated = validateInput(body, 'login');
      
      // Authenticate user
      const user = await authenticateUser(validated);
      
      // Log event
      await logEvent('user_login', { userId: user.id, ip: request.ip });
      
      return NextResponse.json({ 
        success: true, 
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      await logEvent('login_failed', { error: error.message, ip: request.ip });
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
  }
  
  static async register(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Validate input
      const validated = validateInput(body, 'register');
      
      // Register user
      const user = await registerUser(validated);
      
      // Log event
      await logEvent('user_register', { userId: user.id, ip: request.ip });
      
      return NextResponse.json({ 
        success: true, 
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      await logEvent('register_failed', { error: error.message, ip: request.ip });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
```

## Property Service
# src/services/property-service/controllers/property.controller.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createProperty, getProperties, updateProperty } from '@/shared/utils/property-db';
import { cacheGet, cacheSet } from '@/shared/utils/redis';
import { logEvent } from '@/shared/utils/logger';

export class PropertyController {
  static async getProperties(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const cacheKey = `properties:${searchParams.toString()}`;
      
      // Check cache first
      const cached = await cacheGet(cacheKey);
      if (cached) {
        return NextResponse.json(JSON.parse(cached));
      }
      
      // Fetch from database
      const properties = await getProperties(searchParams);
      
      // Cache result
      await cacheSet(cacheKey, JSON.stringify(properties), 300); // 5 minutes
      
      return NextResponse.json(properties);
    } catch (error) {
      await logEvent('property_fetch_error', { error: error.message });
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
  }
  
  static async createProperty(request: NextRequest) {
    try {
      const body = await request.json();
      
      // Create property
      const property = await createProperty(body);
      
      // Invalidate cache
      await cacheSet('properties:*', '', 1); // Pattern deletion
      
      // Log event
      await logEvent('property_created', { 
        propertyId: property.id, 
        userId: request.user?.id 
      });
      
      return NextResponse.json({ success: true, property });
    } catch (error) {
      await logEvent('property_create_error', { error: error.message });
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
  }
}
```

## Service Startup Scripts
# scripts/start-services.sh
```bash
#!/bin/bash

# Start all microservices
echo "Starting microservices..."

# Auth Service (Port 3001)
PORT=3001 npm run service:auth &
echo "Auth service started on port 3001"

# Property Service (Port 3002)
PORT=3002 npm run service:property &
echo "Property service started on port 3002"

# Image Service (Port 3003)
PORT=3003 npm run service:image &
echo "Image service started on port 3003"

# Search Service (Port 3004)
PORT=3004 npm run service:search &
echo "Search service started on port 3004"

# Analytics Service (Port 3005)
PORT=3005 npm run service:analytics &
echo "Analytics service started on port 3005"

wait
```

## Package.json Scripts
```json
{
  "scripts": {
    "service:auth": "next build && next start -p 3001",
    "service:property": "next build && next start -p 3002",
    "service:image": "next build && next start -p 3003",
    "service:search": "next build && next start -p 3004",
    "service:analytics": "next build && next start -p 3005",
    "services:start": "./scripts/start-services.sh",
    "services:dev": "concurrently \"npm run service:auth\" \"npm run service:property\" \"npm run service:image\" \"npm run service:search\" \"npm run service:analytics\""
  }
}
```

## PM2 Configuration
# ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'npm',
      args: 'run service:auth',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'property-service',
      script: 'npm',
      args: 'run service:property',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'image-service',
      script: 'npm',
      args: 'run service:image',
      env: {
        PORT: 3003,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'search-service',
      script: 'npm',
      args: 'run service:search',
      env: {
        PORT: 3004,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'analytics-service',
      script: 'npm',
      args: 'run service:analytics',
      env: {
        PORT: 3005,
        NODE_ENV: 'production'
      }
    }
  ]
};
```

## Deployment Commands
```bash
# Install PM2 globally
npm install -g pm2

# Start all services
pm2 start ecosystem.config.js

# Monitor services
pm2 monit

# View logs
pm2 logs

# Restart specific service
pm2 restart auth-service
```
