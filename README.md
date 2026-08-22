# Job Application Tracker - React Frontend

Standalone React + TypeScript + Vite + Tailwind CSS frontend for the Job Application Tracker featuring automated Gmail OAuth2 syncing, LLM AI classification badges & reasoning, interactive Email Review Queue, Grid & Kanban Board views, CSV/Excel import, Excel export, and automated Cloudflare Pages & GitHub Pages deployment.

🌐 **Live Demo**: [https://jobtracker-7aq.pages.dev/](https://jobtracker-7aq.pages.dev/)

---

## ⚡ Features

- 📊 **Interactive Dashboard & Analytics**: Real-time summary cards, application conversion rates, platform distribution, and monthly application trends.
- 🤖 **✨ LLM AI Email Classification**: Visual indicators for AI-analyzed emails vs. rule-parsed emails (`✨ AI Analyzed` badge, confidence scores, and AI reasoning callout boxes).
- 📧 **Automated Gmail Sync & Review Queue**: Connect Gmail via Google OAuth2, trigger background sync, preview extracted metadata (Company, Role, Status, Recruiter), and approve or ignore emails before adding to your tracker.
- 📋 **Kanban Board & Data Grid Views**: Toggle between a drag-and-drop Kanban pipeline and a filterable, paginated data grid.
- 🔍 **Advanced Search & Filtering**: Filter applications by status (`Applied`, `Interviewing`, `Offer`, `Rejected`, etc.), platform (`LinkedIn`, `Indeed`, etc.), and keyword search.
- 📥 **CSV & Excel Import/Export**: Bulk import application history and export tracking data to Excel spreadsheets.
- 📱 **Mobile Responsive Design**: Optimized viewport scrolling and responsive card views across mobile, tablet, and desktop viewports.

---

## Tech Stack
- **Framework**: React 18 / 19 with TypeScript & Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State & Data Fetching**: TanStack React Query v5, Axios
- **Deployment**: Cloudflare Pages (`https://jobtracker-7aq.pages.dev/`), GitHub Pages (`gh-pages`), Docker (Nginx)

---

## Standalone Git Repository Setup

To push this frontend directory as its own independent GitHub repository:

```bash
cd job-tracker-frontend
git init
git add .
git commit -m "Initial commit: Job Application Tracker Frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-tracker-frontend.git
git push -u origin main
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

By default, Vite proxies `/api` requests to `http://127.0.0.1:8000` (Django backend).

---

## 🚀 Deploying

### Option 1: Cloudflare Pages (Production Live Demo)
1. Connect your GitHub repository to Cloudflare Pages.
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`

### Option 2: GitHub Pages (Automated Workflow)
1. In your GitHub Repository Settings:
   - Go to **Settings** > **Pages**.
   - Under **Source**, select **Deploy from a branch** (`gh-pages`).
2. Set your backend API URL in **Repository Secrets**:
   - `VITE_API_URL`: `https://your-backend-api.com/api`

### Option 3: Manual Deployment
```bash
export VITE_API_URL=https://your-backend-api.com/api
npm run deploy
```

---

## 🐳 Docker Production Setup

```bash
# Build Docker image with target backend API
docker build --build-arg VITE_API_URL=https://your-backend-api.com/api -t job-tracker-frontend .

# Run container on port 80
docker run -p 80:80 job-tracker-frontend
```
