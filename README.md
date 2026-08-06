# Job Application Tracker - React Frontend

Standalone React + TypeScript + Vite + Tailwind CSS frontend for the Job Application Tracker with Grid & Kanban Board views, CSV/Excel import, Excel export, and automated GitHub Pages deployment.

---

## Tech Stack
- **Framework**: React 18 / 19 with TypeScript & Vite
- **Styling**: Tailwind CSS (Tailwind UI design system compliant)
- **Icons**: Lucide Icons
- **State & Query**: TanStack React Query v5, Axios
- **Forms**: React Hook Form
- **Deployment**: GitHub Pages (`gh-pages`) & Docker (Nginx)

---

## Standalone Git Repository Setup

To push this frontend directory as its own independent GitHub repository:

```bash
cd frontend
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

## 🚀 Deploying to GitHub Pages

### Method 1: Automated GitHub Actions (Recommended)
1. Push your code to your `job-tracker-frontend` GitHub repository.
2. In your GitHub Repository Settings:
   - Go to **Settings** > **Pages**.
   - Under **Source**, select **Deploy from a branch**.
   - Choose `gh-pages` branch and `/ (root)`.
3. (Optional) Set your backend API URL in **Settings** > **Secrets and variables** > **Actions** > **Repository secret**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-api.com/api`

### Method 2: Manual CLI Deployment
```bash
# Set your production backend API URL
export VITE_API_URL=https://your-backend-api.com/api

# Build & deploy to gh-pages branch
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
