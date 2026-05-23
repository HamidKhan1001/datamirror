# DataMirror Production Deployment Guide

## 🚀 Scaling to 1M+ Users

### Database: Neon PostgreSQL

1. **Create Neon Project**
   - Go to https://console.neon.tech
   - Create new project
   - Copy connection string

2. **Set Environment Variable**
   ```bash
   export DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```

3. **Run Migrations**
   ```bash
   alembic upgrade head
   ```

### Architecture for Scale

```
┌─────────────┐
│   CDN       │  (Vercel, Cloudflare)
└──────┬──────┘
       │
┌──────▼──────────────────┐
│   Load Balancer         │  (Nginx, Railway, Vercel)
└──────┬──────────────────┘
       │
┌──────▼──────┐  ┌──────────┐  ┌──────────┐
│  API Pod 1  │  │ API Pod 2│  │ API Pod N│  (Auto-scaling)
└──────┬──────┘  └──────────┘  └──────────┘
       │
       └──────────┬──────────────┬──────────┐
                  │              │          │
            ┌─────▼──────┐ ┌────▼────┐ ┌──▼────┐
            │ Redis      │ │ Cache   │ │ Queue │
            │ (Optional) │ │ Layer   │ │ (Bull)│
            └────────────┘ └─────────┘ └───────┘
                  │
            ┌─────▼────────────────┐
            │ Neon PostgreSQL      │
            │ (Connection Pooling) │
            └──────────────────────┘
```

### Performance Optimizations

1. **Database Indexing** - Already included in models
2. **Connection Pooling** - QueuePool with size=20, max_overflow=40
3. **Query Optimization** - Use indexed fields for filtering
4. **Caching Layer** - Redis for frequently accessed data
5. **Rate Limiting** - Per-IP, per-endpoint
6. **Batch Operations** - Insert multiple records atomically

### Deployment Options

#### Option 1: Railway.app (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login & deploy
railway login
railway link
railway up
```

#### Option 2: Vercel Functions (Serverless)
```bash
vercel deploy
```

#### Option 3: Docker (Any cloud)
```bash
docker build -t datamirror-api .
docker run -e DATABASE_URL=$DB_URL datamirror-api
```

### Environment Variables (Production)

```env
# Production
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
ANTHROPIC_API_KEY=sk-...

# Performance
DB_POOL_SIZE=50
DB_MAX_OVERFLOW=100
WORKER_THREADS=8
RATE_LIMIT_PER_MINUTE=1000

# Caching
CACHE_ENABLED=true
REDIS_URL=redis://user:pass@host:6379/0

# Monitoring
LOG_LEVEL=WARNING
SENTRY_DSN=https://...
```

### Load Testing

```bash
# Install Apache Bench
ab -n 100000 -c 1000 http://localhost:8000/health

# Or use wrk
wrk -t12 -c400 -d30s http://localhost:8000/health
```

### Monitoring

- **Logs**: Railway/Vercel built-in
- **Metrics**: Prometheus + Grafana
- **APM**: Datadog, New Relic, or Sentry
- **Database**: Neon console

### Security Checklist

- [ ] Enable SSL/TLS (database)
- [ ] Set strong BACKEND_SECRET
- [ ] Enable rate limiting
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable CORS restrictions
- [ ] Add request validation
- [ ] Use secure headers (Helmet.js for Express)
- [ ] Monitor for abuse patterns

### Cost Estimation (1M users/day)

**Neon Database**:
- Compute: ~$50-200/month (auto-scaling)
- Storage: ~$0.50/GB/month

**API Hosting** (Railway/Vercel):
- ~$10-100/month depending on traffic

**Redis Cache** (Optional):
- ~$20-50/month

**Total**: ~$100-300/month for 1M users/day

---

**Next Steps**: Configure Neon, test load, then deploy!
