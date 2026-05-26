# 🚨 Helpora – Smart Disaster Management & Relief Coordination Platform

Helpora is a full‑stack web application that connects disaster victims with nearby NGOs in real time. Victims can report emergencies (including SOS), specify needed resources (type & quantity), and receive live status updates. NGOs can view nearby reports, get intelligent match recommendations, manage their inventory, and coordinate responses – all in real time.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/atlas)

---

## ✨ Key Features

- **Role‑based authentication** (Victim, NGO, Admin) with JWT & bcrypt
- **Real‑time disaster reporting** (Socket.io) – new reports appear instantly on NGO dashboards
- **Geospatial matching** – NGOs see reports within a configurable radius (MongoDB `2dsphere` & `$near`)
- **Smart resource allocation** – Victims specify needed resources (e.g., food 50 kg, water 100 L). NGOs see match badges and a ranked list of nearby organisations
- **Auto‑deduction of resources** – When an NGO accepts a report, requested quantities are deducted from their inventory
- **Low‑stock alerts** – NGOs receive real‑time warnings when a resource falls below 20 units
- **Request & response history** – Victims can view all their past reports; NGOs see their accepted/resolved reports
- **Interactive map picker** – Leaflet + OpenStreetMap with BigDataCloud reverse geocoding (free, keyless)
- **Admin panel** – Verify NGOs, view system statistics (total reports, pending reports, etc.)
- **Forgot / reset password** – Secure token‑based flow (email simulation, no actual email sending)
- **SOS flag** – Overrides report urgency to “critical” and triggers immediate alerts
- **AI‑powered chatbot** – Gemini‑based assistant that answers disaster‑related questions and platform usage

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Tailwind CSS, Axios, Socket.io‑client, Leaflet, React Router, React Hot Toast |
| **Backend** | Node.js, Express, Socket.io, JWT, bcrypt, Google Gemini AI |
| **Database** | MongoDB Atlas, Mongoose ODM (2dsphere geospatial indexes) |
| **Geocoding** | BigDataCloud (reverse), OpenStreetMap (forward search) |
| **Deployment** | Render (backend), Vercel (frontend), MongoDB Atlas |

---

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB Atlas account (free tier) or local MongoDB
- Google Gemini API key (free from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/helpora.git
   cd helpora
   ```
2. **Backend Setup**
```bash
cd server
cp .env.example .env          # create environment file
npm install
```

2. **Frontendend Setup**
```bash
cd ../client
cp .env.example .env          # optional – create environment file
npm install
```

2. **Run the app**


**Backend:**
```bash
cd server && npm run dev
```

**Frontend:**
```bash
cd client && npm run dev
```

**Open**
```bash
http://localhost:5173**
```

**Environmental variables**
**Backend**
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/helpora
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
CLIENT_URL=http://localhost:5173
```
**Frontend**
```bash
VITE_API_URL=http://localhost:3000
```
## 📋 Manual Flow

1. **Register a victim and an NGO** (NGO needs location)
2. **Victim creates a report** with needed resources
3. **NGO sees report with match badge**, accepts → resources deducted
4. **Victim receives notification** (in‑app toast); history updates
5. **Admin verifies NGOs** and views statistics
6. **Ask the AI chatbot** a question (e.g., “How to report a flood?”)

