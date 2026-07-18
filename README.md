# 🚑 ResQ AI

> *Every Second Saves a Life.*

An AI-powered Emergency Incident Triage and Response System that helps citizens report emergencies quickly and assists emergency coordinators in prioritizing and managing incidents through a centralized dashboard.

![ResQ AI](https://img.shields.io/badge/ResQ-AI-red?style=for-the-badge&logo=first-aid)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=flat-square&logo=fastapi)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 🎯 Problem Statement

Emergency response today is often delayed because reports are processed manually. Citizens struggle to explain incidents accurately, while emergency services receive many reports simultaneously and must manually determine which require immediate attention.

**ResQ AI** solves this by providing:
- Quick emergency reporting for citizens
- AI-powered incident classification and severity estimation
- Automated first-aid guidance generation
- A real-time admin dashboard for emergency coordinators

---

## ✨ Features

### For Citizens
- 📝 Report emergencies with images and descriptions
- 🤖 AI-powered incident analysis and classification
- 🩹 Instant first-aid recommendations
- 📊 Track report status and history
- 🔔 Real-time status notifications

### For Administrators
- 📈 Real-time analytics dashboard
- 🔍 Search, filter, and sort incidents
- 🚨 Priority-based incident management
- 📊 Charts and statistics
- ✅ Status management workflow

### AI Capabilities
- 🖼️ Image-based incident classification
- ⚠️ Severity prediction (Critical/High/Medium/Low)
- 🏥 Emergency service recommendations
- 🩹 First-aid instruction generation
- 📋 Structured report generation

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, Framer Motion |
| **Backend** | FastAPI, Python 3.10+ |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Clerk |
| **Storage** | Supabase Storage |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | Vercel (frontend), Railway (backend) |

---

## 📁 Project Structure

```
ResQ-AI/
├── client/                    # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── landing/       # Landing page sections
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   └── layout/        # Layout components
│   │   ├── pages/
│   │   │   ├── citizen/       # Citizen pages
│   │   │   └── admin/         # Admin pages
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── server/                    # FastAPI backend
│   ├── main.py
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── database/
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

---

## 🔄 Incident Categories

| Category | Icon |
|----------|------|
| Road Accident | 🚗 |
| Fire | 🔥 |
| Flood | 🌊 |
| Medical Emergency | 🏥 |
| Earthquake | 🌍 |
| Building Collapse | 🏚️ |
| Gas Leak | 💨 |
| Chemical Spill | ☣️ |

---

## 📊 Severity Levels

| Level | Color | Description |
|-------|-------|-------------|
| **Critical** | 🔴 Red | Immediate life threat |
| **High** | 🟠 Orange | Serious, urgent attention |
| **Medium** | 🟡 Yellow | Moderate, needs response |
| **Low** | 🟢 Green | Minor, non-urgent |

---

## 🔄 Incident Status Flow

```
Pending → Assigned → In Progress → Resolved → Closed
```

---

## 👥 User Roles

### Citizen
- Register and login
- Report emergencies
- Upload images
- View AI analysis
- Track report history

### Admin
- View all incidents
- Filter and search reports
- Update incident status
- View analytics and charts
- Generate reports

---

## 🔮 Future Scope

- 🚁 Drone Integration
- 🏥 Hospital API Integration
- 🚑 Ambulance Tracking
- 🎙️ Voice Reporting
- 📴 Offline Mode
- 📱 SMS Alerts
- 🏛️ Government Integration

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

Built with ❤️ for emergency response innovation.

*Every second saves a life.* 🚑
