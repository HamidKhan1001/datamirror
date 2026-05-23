# Environment Configuration Guide

## Backend Environment Variables

### Production (Neon PostgreSQL)
```env
# Application
ANTHROPIC_API_KEY=your_anthropic_api_key
BACKEND_SECRET=production_backend_secret
ADMIN_SECRET_KEY=production_admin_key

# Database - Neon PostgreSQL
DATABASE_URL=postgresql://neondb_owner:npg_GOz2Hnscer9N@ep-green-voice-aqkoipuu-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Connection Pooling (for Neon/PostgreSQL)
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40
DB_POOL_RECYCLE=3600
DB_POOL_PRE_PING=true

# Redis Cache (optional)
REDIS_URL=redis://localhost:6379/0
CACHE_ENABLED=false
CACHE_TTL=3600

# CORS
ALLOWED_ORIGINS=https://datamirror.vercel.app,https://your-domain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Environment & Logging
ENVIRONMENT=production
LOG_LEVEL=INFO
WORKER_THREADS=4
REQUEST_TIMEOUT=30
```

### Local Development (SQLite)
```env
# Application
ANTHROPIC_API_KEY=mock_api_key
BACKEND_SECRET=local_backend_secret
ADMIN_SECRET_KEY=admin123

# Database - SQLite (local)
DATABASE_URL=sqlite:///./datamirror.db

# Connection Pooling
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40
DB_POOL_RECYCLE=3600
DB_POOL_PRE_PING=true

# Redis Cache
REDIS_URL=redis://localhost:6379/0
CACHE_ENABLED=false
CACHE_TTL=3600

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Environment & Logging
ENVIRONMENT=development
LOG_LEVEL=DEBUG
WORKER_THREADS=4
REQUEST_TIMEOUT=30
```

---

## Frontend Environment Variables

### Production (.env.production)
```env
# Backend API
BACKEND_URL=https://datamirror-backend.railway.app
BACKEND_SECRET=production_backend_secret
ADMIN_SECRET_KEY=production_admin_key
NEXT_PUBLIC_APP_VERSION=1.0.0

# Application Settings
NEXT_PUBLIC_APP_NAME=DataMirror
NEXT_PUBLIC_ENABLE_TRACKING=true
NEXT_PUBLIC_ENABLE_AI_ANALYSIS=true

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=datamirror_prod
```

### Development (.env.local)
```env
# Backend API
BACKEND_URL=http://localhost:8000
BACKEND_SECRET=local_backend_secret
ADMIN_SECRET_KEY=admin123
NEXT_PUBLIC_APP_VERSION=1.0.0

# Application Settings
NEXT_PUBLIC_APP_NAME=DataMirror
NEXT_PUBLIC_ENABLE_TRACKING=true
NEXT_PUBLIC_ENABLE_AI_ANALYSIS=true

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=datamirror_dev
```

---

## Deployment Environment Variables

### Vercel (Frontend)
Set these in Vercel Dashboard → Settings → Environment Variables:

```
BACKEND_URL = https://datamirror-backend.railway.app
NEXT_PUBLIC_APP_NAME = DataMirror
NEXT_PUBLIC_ENABLE_TRACKING = true
NEXT_PUBLIC_ENABLE_AI_ANALYSIS = true
```

### Railway/Heroku (Backend)
Set these in the platform's environment variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_GOz2Hnscer9N@ep-green-voice-aqkoipuu-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ANTHROPIC_API_KEY = your_api_key
BACKEND_SECRET = production_secret
ADMIN_SECRET_KEY = admin_key
ALLOWED_ORIGINS = https://datamirror.vercel.app
ENVIRONMENT = production
LOG_LEVEL = INFO
RATE_LIMIT_PER_MINUTE = 60
```

---

## Summary

| Variable | Backend | Frontend | Purpose |
|----------|---------|----------|---------|
| BACKEND_URL | ✗ | ✓ | Frontend API endpoint |
| DATABASE_URL | ✓ | ✗ | Neon PostgreSQL connection |
| ANTHROPIC_API_KEY | ✓ | ✗ | Claude AI access |
| BACKEND_SECRET | ✓ | ✓ | Secret key (keep safe) |
| ADMIN_SECRET_KEY | ✓ | ✓ | Admin operations key |
| NEXT_PUBLIC_* | ✗ | ✓ | Public frontend config |
