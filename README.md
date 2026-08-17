# 🌟 HireSense AI — Precision Resume Screening & Candidate Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PyMuPDF-1.24-ff5722?style=for-the-badge&logo=python&logoColor=white" alt="PyMuPDF" />
  <img src="https://img.shields.io/badge/SQLite-WAL_Mode-003b57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

---

## 🚀 Live Demo & Interactive Previews

> **Experience the full platform in 1 click without any setup:**

### 🔑 Instant 1-Click Demo Accounts

| Role | Demo Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Candidate Portal** | `alex.dev@example.com` | `password123` | Upload Resumes, ATS Score Breakdown, Score Boost Roadmap, Job Recommendations, Real-time Pipeline Tracking |
| **Recruiter Portal** | `recruiter@techinnovations.com` | `password123` | Post Jobs, Candidate Screening Table, 1-Click Shortlisting, Gmail & Google Meet Video Dispatch, Analytics |

---

## 📱 Mobile & iOS Ready

HireSense AI is engineered with full **iOS (Safari / iPhone / iPad)**, **Android**, and **Tablet** responsiveness:
* **Adaptive Dual-Layouts**: Wide tables automatically transform into touch-friendly cards on mobile devices.
* **iOS Safe-Area Inset Support**: Designed for iPhone Dynamic Island and gesture home bars (`viewport-fit=cover`).
* **Instant In-App Mailbox Popover**: Mobile-friendly interview invitation alerts and Google Meet links.

---

## ✨ Core Platform Capabilities

### 1. 🎯 Precision ATS & Resume Intelligence Engine
* **Calibrated Benchmark Scoring**: Aligned with industry evaluation standards (ResumeWorded / Jobscan).
* **Recruiter Audit Checks**:
  * 📊 **Quantify Impact**: Detects measurable business metrics (%, $, latency, user scale).
  * ⏳ **Experience Depth**: Distinguishes between academic projects, internships, and verified tenure.
  * ⚡ **Action Verbs**: Audits active power verbs vs passive phrases.
  * 🗂️ **Skills Breadth**: Multi-tier categorization across languages, frameworks, and cloud systems.
* **+40 Points Score Boost Roadmap**: Step-by-step actionable recommendations to transform developing resumes into elite profiles.

### 2. 🧠 Multi-Alias FastAPI & React Skill Extraction
* Robust normalization engine recognizing `FastAPI`, `Fast API`, `Fast-API`, `fastapi`, `React`, `React.js`, `ReactJS`, `Next.js`.
* **Framework Inheritance**: Automatically links `Next.js` ➔ `React` and Python API development ➔ `FastAPI`.

### 3. 💼 Candidate Pipeline Command & Concurrency
* Global applicant filtering across all positions via `GET /api/v1/applications/recruiter/all`.
* **1-Click Shortlist (⭐)** and dynamic stage tabs (*Shortlisted ✓*, *Under Review ⏳*, *Interview 📅*, *Declined ✗*).
* **SQLite WAL Mode**: Configured with 30s busy timeout and automated connection cleanup to prevent database locking during rapid multi-user status updates.

### 4. 📅 Gmail & Video Interview Dispatch
* **Google Meet Generator**: Automated video meeting room link creation.
* **Gmail Integration**: Generates pre-filled Gmail invitations with candidate email, role title, and interview schedule.
* **In-App Candidate Mailbox**: Push notification bell with live unread badge count in the navigation bar.

### 5. 🔐 Account Recovery & Authentication
* Dynamic error detection with direct password reset flow and secure salt + SHA-256 token verification.

---

## 🏗️ Architecture & Technology Stack

```
HireSense-Ai/
├── ai/
│   ├── extraction/
│   │   ├── pdf_parser.py       # High-performance PyMuPDF text & structure extractor
│   │   └── info_extractor.py   # ATS scorer, recruiter checks, multi-alias synonyms
│   ├── matching/
│   │   ├── scorer.py           # Multi-dimensional cosine & heuristic matching
│   │   └── explainer.py        # Natural language AI match rationale generator
│   └── embeddings/
│       └── embedder.py         # High-dimensional semantic vector embeddings
├── backend/
│   ├── server.py               # REST API server (Auth, Resumes, Jobs, Interviews, Mailbox)
│   ├── hiresense.db            # SQLite database in WAL mode
│   └── tests/                  # Automated verification test suite
└── frontend/
    ├── src/
    │   ├── components/         # Navigation, Mailbox Popover, Modals, Expandable Tabs
    │   ├── pages/              # Candidate & Recruiter Dashboards, Screening, Analyzer
    │   └── api/                # API client with token management
    └── index.html              # Mobile iOS/Android viewport & fonts
```

---

## ⚡ Local Quickstart Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**

### 1. Clone the Repository
```bash
git clone https://github.com/Timee14/HireSense-Ai.git
cd HireSense-Ai
```

### 2. Start Backend Server
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python server.py
```
> Backend runs at: `http://localhost:8000`

### 3. Start Frontend Development Server
```bash
cd ../frontend
npm install
npm run dev
```
> Frontend runs at: `http://localhost:5173`

---

## 🌐 1-Click Cloud Deployment (Vercel & Render)

### Deploy Frontend to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Timee14/HireSense-Ai)

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Click **Deploy**!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).\n