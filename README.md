# DataMirror 🎯

**Production-ready browser fingerprinting & user analytics platform**
Scales to 1M+ users with Neon PostgreSQL, Redis caching, and containerized deployment.

[![CI/CD Pipeline](https://github.com/HamidKhan1001/datamirror/actions/workflows/ci.yml/badge.svg)](https://github.com/HamidKhan1001/datamirror/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### Advanced Tracking
- 🖥️ **Device Fingerprinting**: Canvas, WebGL, Audio, Font-based identification
- 🎯 **Heatmap Tracking**: Mouse movement, click positions, scroll patterns
- ⌨️ **Keyboard Dynamics**: Typing rhythm biometrics & consistency scoring
- 📍 **Geolocation**: IP detection, timezone, ISP, VPN detection
- 🔄 **Session Tracking**: Multi-visit persistence & behavioral patterns
- 🌐 **Browser Capabilities**: WebGL, Audio API, IndexedDB, Service Workers

### Production-Ready
- 🗄️ **Neon PostgreSQL** with connection pooling (20+ concurrent connections)
- ⚡ **Redis Caching** for high-frequency data
- 🐳 **Docker** containerization for any cloud
- 📊 **AI Analysis** (Claude integration for fingerprint interpretation)
- 🔐 **Rate Limiting** per IP & endpoint
- 📈 **Scalable to 1M+ daily active users**

## 📋 Architecture

```
┌─────────────────────────────────────────┐
│         Next.js Frontend (React)        │
│  • Fingerprint collectors               │
│  • Real-time telemetry display          │
└─────────────────┬───────────────────────┘
                  │ API Calls
┌─────────────────▼───────────────────────┐
│   FastAPI Backend (Connection Pool)     │
│  • Authorization & rate limiting        │
│  • Fingerprint analysis                 │
│  • Database persistence                 │
└─────────────────┬───────────────────────┘
        ┌─────────┼─────────┐
        │         │         │
    ┌───▼──┐  ┌──▼───┐  ┌─▼────┐
    │Neon  │  │Redis │  │Cache │
    │ DB   │  │ 6379 │  │Layer │
    └──────┘  └──────┘  └──────┘
```

## 🎯 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (optional)

### Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/HamidKhan1001/datamirror.git
cd datamirror

# Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Start servers
# Terminal 1
cd backend && python -m uvicorn app.main:app --reload --port 8000

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:3000 🎉

## 🐳 Docker Deployment

```bash
# Using docker-compose (with PostgreSQL & Redis)
docker-compose up -d

# Production build
docker build -t datamirror:latest backend/
docker run -e DATABASE_URL=$NEON_DB_URL datamirror:latest
```

## 📊 Database Configuration

### Local (SQLite)
```env
DATABASE_URL=sqlite:///./datamirror.db
```

### Production (Neon PostgreSQL)
```env
# Get from https://console.neon.tech
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DB_POOL_SIZE=50
DB_MAX_OVERFLOW=100
```

## 🔧 Configuration

Key environment variables:

```env
# Database
DATABASE_URL=postgresql://...
DB_POOL_SIZE=20

# Cache (optional)
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379/0

# Performance
WORKER_THREADS=4
RATE_LIMIT_PER_MINUTE=1000

# Security
BACKEND_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-... (optional)
```

See `PRODUCTION_SETUP.md` for detailed configuration.

## 📈 Scaling to 1M+ Users

1. **Use Neon PostgreSQL** for auto-scaling database
2. **Enable Redis** for frequently accessed data
3. **Deploy with Docker** on Railway, Vercel, or AWS
4. **Monitor with** Datadog, New Relic, or Sentry
5. **Use CDN** (Vercel, Cloudflare) for frontend

**Estimated cost**: $100-300/month for 1M users/day

See `PRODUCTION_SETUP.md` for detailed guide.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest --cov=app

# Frontend tests
cd frontend
npm run test

# Load testing
ab -n 100000 -c 1000 http://localhost:8000/health
```

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute setup guide
- [PORTFOLIO_README.md](./PORTFOLIO_README.md) - Project details & architecture
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Scaling & deployment guide
- [GITHUB_AUTH_SETUP.md](./GITHUB_AUTH_SETUP.md) - GitHub authentication

## 🔒 Privacy & Ethics

This project demonstrates advanced tracking capabilities for **educational & portfolio purposes**.

⚠️ **Important**:
- Users must be **informed** when tracking is enabled
- Comply with **GDPR, CCPA**, and local privacy laws
- Implement proper **consent mechanisms**
- Delete collected data appropriately
- Never use for malicious purposes

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze browser fingerprint |
| GET | `/health` | Health check |
| GET | `/admin/stats` | Admin statistics |

See API docs: http://localhost:8000/docs

## 🚀 Deployment

### Railway.app (Recommended)
```bash
railway login
railway link
railway up
```

### Vercel + Neon
```bash
vercel deploy
# Configure Neon DB in Vercel environment
```

### AWS / GCP / Azure
Use Docker image with auto-scaling

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m "Add amazing feature"`)
4. Push branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

## 📧 Contact

**Hamid Khan**
- GitHub: [@HamidKhan1001](https://github.com/HamidKhan1001)
- Portfolio: [datamirror.dev](#)

---

**⭐ Star this repo if you find it helpful!**

Built for portfolio showcase | Production-ready | Scale to millions
