# DataMirror - Browser Fingerprinting & Analytics Platform

**A comprehensive portfolio project showcasing advanced browser tracking, device fingerprinting, and user analytics.**

## 🎯 Project Overview

DataMirror is a full-stack web application that demonstrates sophisticated techniques for:
- **Browser Fingerprinting**: Canvas, WebGL, Audio, Font-based identification
- **Device Profiling**: Hardware capabilities, display, network, and sensor detection
- **Session Tracking**: Multi-session persistence and behavioral patterns
- **User Behavior Analytics**: Heatmaps, scroll patterns, click tracking, keyboard dynamics
- **Geolocation & IP Tracking**: Network-level identification
- **Biometric Profiling**: Typing rhythm, mouse velocity, interaction patterns

## 🏗️ Architecture

### Frontend (Next.js 16 + React 19)
- **Modern TypeScript** implementation with strict type safety
- **Real-time telemetry** collection without page reloads
- **Multiple fingerprinting strategies**:
  - Canvas fingerprinting
  - WebGL fingerprinting
  - Audio fingerprint detection
  - Font enumeration
  - Hardware capability detection
  
- **Advanced Tracking Collectors**:
  - **Heatmap Collector**: Mouse movement tracking and click location analysis
  - **Session Manager**: Persistent cross-session tracking with storage
  - **Keyboard Dynamics**: Typing pattern and rhythm profiling
  - **IP/Geolocation**: Network-level user identification
  - **Behavioral Tracker**: Mouse velocity, scroll patterns, focus events

### Backend (FastAPI + Python)
- **RESTful API** for fingerprint analysis and data persistence
- **Database models** for tracking:
  - `Scan`: Individual fingerprint scans with AI analysis
  - `BrowserSession`: Multi-visit session data
  - `UserBehavior`: Detailed interaction patterns (heatmaps, scrolling, keyboard)
  - `DeviceCapabilities`: Hardware and software specifications
  
- **AI Integration** (Claude): Advanced fingerprint classification and pattern analysis
- **CORS-enabled**: Safe cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.10+ (backend)
- Anthropic API key (optional, defaults to mock mode)

### Installation

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
# API at http://localhost:8000/docs
```

## 📊 Tracking Features Explained

### 1. **Device Fingerprinting**
- Combines 40+ data points to create unique device identifier
- Canvas, WebGL, Audio, and Font-based signatures
- Hardware detection (CPU cores, RAM, GPU capabilities)
- Display properties (resolution, color depth, pixel ratio)

### 2. **Session Tracking**
- `SessionManager`: Track user across multiple page visits
- Persistent session IDs across page reloads
- Visitor profile tracking with localStorage
- Cross-tab session awareness

### 3. **Behavioral Analytics**
- **Heatmap Tracking**: Every mouse movement and click position
- **Scroll Analysis**: Velocity, depth, direction, and pause detection
- **Click Patterns**: Button type, frequency, location clustering
- **Dwell Time**: How long users interact with elements

### 4. **Keyboard Dynamics**
- Typing speed and rhythm patterns
- Key hold duration (dwell time)
- Keystroke intervals and consistency
- Estimated WPM (words per minute)
- *Privacy note: Only captures metadata, not actual characters*

### 5. **Network & Location**
- Real IP address detection (via public APIs)
- Geolocation inference (city, country, timezone)
- ISP detection
- VPN/Proxy detection
- Network type and speed metrics

### 6. **Browser Capability Detection**
- WebGL version and vendor info
- Audio context fingerprint
- Storage capabilities (localStorage, IndexedDB, cookies)
- Touch support and sensor detection
- Service Worker availability

## 📁 Project Structure

```
datamirror/
├── frontend/                  # Next.js React application
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   │   ├── collection/        # Main fingerprinting engine
│   │   ├── ai/                # AI analysis display
│   │   ├── dashboard/         # Analytics dashboard
│   │   └── ui/                # Shared UI components
│   ├── lib/
│   │   ├── collectors/        # Data collection modules
│   │   │   ├── canvas-fingerprint.ts
│   │   │   ├── webgl-fingerprint.ts
│   │   │   ├── audio-fingerprint.ts
│   │   │   ├── font-fingerprint.ts
│   │   │   ├── behavioral-tracker.ts
│   │   │   ├── heatmap-collector.ts
│   │   │   ├── keyboard-dynamics.ts
│   │   │   ├── ip-geolocation.ts
│   │   │   └── session-manager.ts
│   │   ├── scoring/           # Uniqueness algorithms
│   │   ├── types/             # TypeScript interfaces
│   │   └── api-client.ts      # Backend communication
│   └── public/                # Static assets
│
├── backend/                   # FastAPI Python application
│   ├── app/
│   │   ├── main.py           # FastAPI app setup
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # DB initialization
│   │   ├── routers/          # API endpoints
│   │   │   ├── health.py     # Health checks
│   │   │   ├── analyze.py    # Fingerprint analysis
│   │   │   └── admin.py      # Admin dashboard
│   │   ├── services/         # Business logic
│   │   │   ├── claude_service.py
│   │   │   ├── fingerprint_analyzer.py
│   │   │   ├── profile_classifier.py
│   │   │   └── recommendation_engine.py
│   │   └── utils/            # Utilities
│   ├── requirements.txt       # Python dependencies
│   └── pyproject.toml         # Project metadata
```

## 🔒 Privacy & Ethics

**Important**: This project is designed for **educational and portfolio purposes only**.

While DataMirror demonstrates advanced tracking capabilities, remember:
- Users should be **informed** when tracking is enabled
- Tracking should comply with **GDPR, CCPA**, and local privacy laws
- Real deployment requires **proper consent mechanisms**
- Collected data should be **protected and deleted** appropriately
- This is a demonstration of what's possible, not a recommendation to do it

## 🎓 Learning Outcomes

This project teaches:
- Advanced browser APIs (Canvas 2D, WebGL, Web Audio API)
- Full-stack TypeScript development
- Database design for analytics
- Frontend performance optimization
- API design with FastAPI
- Privacy-aware system architecture
- Real-world challenges in data collection

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16.2.6
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- ESLint

**Backend:**
- FastAPI 0.109.0+
- SQLAlchemy 2.0.0+
- Pydantic 2.6.0+
- Uvicorn 0.27.0+
- Anthropic SDK (for Claude integration)

## 📈 API Endpoints

### Health Check
```
GET /health
```

### Analyze Fingerprint
```
POST /analyze
Content-Type: application/json

{
  "fingerprint_hash": "...",
  "browser_metrics": {...},
  "device_metrics": {...},
  "session_data": {...}
}
```

### Admin Dashboard
```
GET /admin
GET /admin/stats
GET /admin/scans
```

## 🚦 Future Enhancements

- [ ] Real-time analytics dashboard with Chart.js
- [ ] Machine learning models for behavior classification
- [ ] Comparative fingerprint analysis
- [ ] Geographic heatmaps
- [ ] Export capabilities (CSV, JSON)
- [ ] Advanced filtering and search
- [ ] Performance metrics dashboard
- [ ] Rate limiting and abuse detection

## 📝 License

This project is for **educational purposes only**. Use responsibly and in compliance with all applicable laws and regulations.

---

**Created for Portfolio Showcase** | Browser Fingerprinting & Analytics Techniques
