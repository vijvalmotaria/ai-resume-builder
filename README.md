# 🚀 AI-Powered ATS Resume Builder & Career Coach

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4.svg?logo=google)
![LangChain](https://img.shields.io/badge/LangChain-Orchestrated-1C3C3C.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)

An enterprise-grade, full-stack web application designed to help job seekers beat automated **Applicant Tracking Systems (ATS)** and land top-tier interviews. Powered by **Google Gemini AI**, **LangChain**, and a modern **React 19** frontend, this platform evaluates resumes against actual job postings, extracts quantifiable accomplishments, generates STAR-method bullet points, and provides a real-time 10-point ATS compliance audit.

---

## 📌 The Problem
Over **90% of Fortune 500 companies** use an Applicant Tracking System (ATS) like Workday, Taleo, Greenhouse, or Lever to automatically parse and filter incoming resumes before any human recruiter ever sees them. Generic resumes lacking targeted keywords, action verbs, or quantifiable metrics get filtered out immediately.

## 💡 The Solution
This AI-Powered Resume Builder combines algorithmic pre-analysis with Google Gemini generative models to provide:
1. **Real-time 10-Point ATS Audit**: Scores Keyword Density, STAR Bullet Quality, ATS Format Compliance, Section Completeness, Summary Strength, Action Verbs, and Quantified Metrics (0–100%).
2. **Autonomous AI Interview Coach**: An interactive chatbot built with LangChain that interviews candidates about their roles to extract measurable results and directly write or update resume sections.
3. **Job Description Keyword Matcher**: Compare any resume against a target job posting to detect matched keywords, missing requirements, and receive AI tailoring advice.
4. **5 High-Converting ATS-Proof Templates**:
   - `Classic ATS` — Clean, serif standard favored by traditional corporate filters.
   - `Modern Tech` — Crisp sans-serif layout with indigo accents and categorized skill pills.
   - `Minimal Clean` — Ultra-clean whitespace aesthetic for modern design & engineering roles.
   - `Executive` — Authoritative navy and gold styling tailored for leadership and management.
   - `Creative Portfolio` — Two-column layout with teal gradient sidebar for creative & portfolio roles.
5. **PDF Upload & AI Parsing**: Upload any existing PDF resume to automatically parse and populate personal info, experience, education, skills, and projects using Gemini Vision/Document processing.
6. **Differentiated Skill Categories**: Dedicated categorization for Programming Languages, Databases, Cloud & DevOps, Frameworks, Tools, Soft Skills, and custom categories.
7. **Version History & Snapshot Revert**: Save tailored versions for specific applications (e.g., "Google Senior Frontend", "Stripe Tech Lead") and restore previous snapshots with one click.
8. **Print & PDF Export**: Native browser-level vector print styles without watermarks.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom typography & glassmorphism
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (Server)
- **Runtime**: [Node.js (ES Modules)](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Authentication**: JWT (JSON Web Tokens) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **File Handling**: [Multer](https://github.com/expressjs/multer) & [pdfjs-dist](https://github.com/mozilla/pdf.js)

### AI & LLM Engine
- **Generative Models**: [Google Gemini 2.5 Flash / 1.5](https://ai.google.dev/) via `@google/genai`
- **Agent Orchestration**: [LangChain](https://js.langchain.com/) (`@langchain/google-genai`, `@langchain/langgraph`, `@langchain/core`)
- **Schema Validation**: [Zod](https://zod.dev/)

---

## 📁 Repository Structure

```text
edureach-platform/
├── client/                     # Frontend React 19 application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/             # ATS Score Card, AI Coach, Job Matcher
│   │   │   ├── editor/         # Section form editors (Experience, Skills, etc.)
│   │   │   ├── templates/      # 5 ATS resume layout templates & previewer
│   │   │   ├── version/        # Version history & snapshot modal
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # AuthContext (JWT management)
│   │   ├── pages/              # LandingPage, LoginPage, SignupPage, DashboardPage, BuilderPage
│   │   ├── services/           # Axios API connectors
│   │   ├── App.jsx             # Route dispatcher
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Node.js & Express API
│   ├── src/
│   │   ├── config/             # Database, Gemini, and Agent tool configurations
│   │   ├── constants/          # Prompt templates for Gemini
│   │   ├── controllers/        # Auth, Resume, AI, and Version controllers
│   │   ├── middleware/         # Auth verification & file upload handlers
│   │   ├── models/             # User, Resume, ChatHistory, ResumeVersion schemas
│   │   ├── routes/             # API route registries
│   │   ├── services/           # AI service, agent service, resume service
│   │   ├── utils/              # Keyword analyzer, format checker, score calculator
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json                # Root workspace scripts
└── README.md
```

---

## ⚡ Installation & Local Setup

### Prerequisites
Before running the application, ensure you have:
1. **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **MongoDB Atlas Account**: A free MongoDB Atlas cluster ([Sign Up](https://www.mongodb.com/cloud/atlas))
3. **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

---

### Step 2: Configure Environment Variables

#### Backend (`server/.env`):
Create a `.env` file in the `server` directory using the provided template:
```bash
cp server/.env.example server/.env
```
Update `server/.env` with your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

> **Important (MongoDB Atlas)**: Make sure your current IP address (or `0.0.0.0/0`) is added to your MongoDB Atlas **Network Access** IP Access List.

#### Frontend (`client/.env`):
Create a `.env` file in the `client` directory:
```bash
cp client/.env.example client/.env
```
Ensure the API URL points to your backend server:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### Step 4: Run the Application

#### Option A: Running separately in two terminals:
**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*Backend starts on `http://localhost:5000`*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Frontend starts on `http://localhost:5173`*

#### Option B: Running from root:
```bash
npm run dev:server    # Starts backend
npm run dev:client    # Starts frontend
```

---

## 📡 Core API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & receive JWT |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile |

### Resumes (`/api/resumes`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resumes` | Create a new resume |
| `GET` | `/api/resumes` | List all user resumes |
| `GET` | `/api/resumes/:id` | Get specific resume details |
| `PUT` | `/api/resumes/:id` | Update resume sections & content |
| `PUT` | `/api/resumes/:id/template` | Switch template (classic, modern, etc.) |
| `DELETE` | `/api/resumes/:id` | Delete resume |
| `POST` | `/api/resumes/upload` | Upload PDF resume for AI parsing |

### AI & ATS Intelligence (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/ats-score` | Calculate 10-point ATS compliance score |
| `POST` | `/api/ai/review` | Run deep AI review & recommendations |
| `POST` | `/api/ai/match-job` | Match resume with target job description |
| `POST` | `/api/ai/generate-bullets` | Generate STAR-method bullet points |
| `POST` | `/api/ai/generate-summary` | Generate executive professional summary |
| `POST` | `/api/ai/chat` | Chat with autonomous AI interview coach |
| `GET` | `/api/ai/chat-history/:id` | Retrieve interview chat history |

### Version Management (`/api/versions`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/versions/:resumeId` | Save snapshot with label |
| `GET` | `/api/versions/:resumeId` | List previous version snapshots |
| `POST` | `/api/versions/:resumeId/:versionId/restore` | Restore previous version |
| `DELETE` | `/api/versions/:resumeId/:versionId` | Delete version snapshot |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
