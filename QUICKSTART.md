# DataMirror - Quick Start Guide

## 🚀 Getting Started

This guide will have you running DataMirror locally in under 5 minutes.

### Prerequisites
- **Node.js**: 18 or higher
- **Python**: 3.10 or higher
- **npm** or **yarn** for frontend dependencies

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

**Frontend** (`frontend/.env.local` - already configured):
```
BACKEND_URL=http://localhost:8000
BACKEND_SECRET=local_backend_secret
ADMIN_SECRET_KEY=admin123
```

**Backend** (`backend/.env` - already configured):
```
ANTHROPIC_API_KEY=mock_api_key
BACKEND_SECRET=local_backend_secret
ADMIN_SECRET_KEY=admin123
DATABASE_URL=sqlite:///./datamirror.db
ALLOWED_ORIGINS=http://localhost:3000
```

### Step 4: Start the Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 16.2.6
  - Local: http://localhost:3000
```

### Step 5: Open in Browser

Navigate to **http://localhost:3000** and click "START COLLECTION SCAN" to begin!

---

## 📊 What You'll See

1. **Live Telemetry Feed**: Real-time data collection logs
2. **Fingerprint Score**: Uniqueness calculation (0-100%)
3. **Device Profile**: Hardware and capability detection
4. **AI Analysis**: Claude-powered fingerprint interpretation
5. **Analytics**: Session tracking, behavior patterns, heatmaps

---

## 🔧 Troubleshooting

### Backend won't start - Port 8000 in use
```bash
# Kill the process using port 8000
lsof -i :8000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

### Frontend won't connect to backend
- Check that backend is running on port 8000
- Verify `BACKEND_URL=http://localhost:8000` in `.env.local`
- Check CORS settings in backend `app/main.py`

### Database errors
```bash
# Reset database
rm backend/datamirror.db
python -m uvicorn app.main:app --reload --port 8000
```

---

## 📈 Exploring the Features

Once running, try:

1. **View Fingerprint Data**: Check browser console (F12) → Network tab
2. **Check Database**: 
   ```bash
   sqlite3 backend/datamirror.db
   SELECT COUNT(*) FROM scans;
   ```
3. **API Documentation**: Visit http://localhost:8000/docs
4. **Admin Panel**: Visit http://localhost:3000/admin (password: admin123)

---

## 🎯 Portfolio Showcase Tips

To impress during code review:

1. **Show the tracking breadth**: 
   - Canvas fingerprinting
   - WebGL detection
   - Session persistence
   - Keyboard dynamics

2. **Highlight architecture**:
   - Full-stack TypeScript
   - Real-time data collection
   - Efficient database schema
   - Clean API design

3. **Discuss privacy/ethics**:
   - Consent mechanisms
   - Data minimization
   - Regulatory compliance (GDPR/CCPA)

---

## 📚 Next Steps

- Add real geolocation API integration
- Implement analytics dashboard with charts
- Create ML model for behavior classification
- Add export capabilities (CSV/JSON)
- Deploy to production (Vercel + Railway/Render)

---

**Questions?** Check `PORTFOLIO_README.md` for detailed documentation!
