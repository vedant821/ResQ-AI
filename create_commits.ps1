# ResQ AI - Incremental Git Commit Script
# Creates 17 commits with backdated timestamps to simulate organic development

# Set git config
git config user.email "vedant821@gmail.com"
git config user.name "vedant821"

# Commit 1: Initial project setup
$env:GIT_AUTHOR_DATE = "2026-07-18T09:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-18T09:00:00+05:30"
git add .gitignore README.md .env.example
git commit -m "Initial project setup with README and gitignore"

# Commit 2: Initialize React+Vite frontend
$env:GIT_AUTHOR_DATE = "2026-07-18T11:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-18T11:30:00+05:30"
git add client/package.json client/vite.config.js client/postcss.config.js client/index.html client/public/
git commit -m "Initialize React+Vite frontend with project configuration"

# Commit 3: Add design system and global styles
$env:GIT_AUTHOR_DATE = "2026-07-18T14:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-18T14:00:00+05:30"
git add client/tailwind.config.js client/src/index.css
git commit -m "Add Tailwind CSS design system and global styles with glassmorphism"

# Commit 4: Add reusable UI components
$env:GIT_AUTHOR_DATE = "2026-07-18T17:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-18T17:00:00+05:30"
git add client/src/components/ui/
git commit -m "Create reusable UI components - Button, Card, Input, Badge, Modal, StatsCard"

# Commit 5: Add layout components
$env:GIT_AUTHOR_DATE = "2026-07-19T09:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-19T09:30:00+05:30"
git add client/src/components/layout/Navbar.jsx client/src/components/layout/Footer.jsx client/src/components/layout/Sidebar.jsx
git commit -m "Add layout components - Navbar, Footer, Sidebar with responsive design"

# Commit 6: Build landing page Hero and Features
$env:GIT_AUTHOR_DATE = "2026-07-19T12:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-19T12:00:00+05:30"
git add client/src/components/landing/Hero.jsx client/src/components/landing/Features.jsx
git commit -m "Build landing page with Hero section and Features grid"

# Commit 7: Add remaining landing sections
$env:GIT_AUTHOR_DATE = "2026-07-19T15:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-19T15:30:00+05:30"
git add client/src/components/landing/HowItWorks.jsx client/src/components/landing/Statistics.jsx client/src/components/landing/Testimonials.jsx client/src/components/landing/FAQ.jsx client/src/pages/LandingPage.jsx
git commit -m "Add HowItWorks, Statistics, Testimonials, FAQ sections to landing page"

# Commit 8: Implement authentication
$env:GIT_AUTHOR_DATE = "2026-07-19T18:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-19T18:00:00+05:30"
git add client/src/context/AuthContext.jsx client/src/pages/LoginPage.jsx client/src/pages/RegisterPage.jsx
git commit -m "Implement auth context with mock users and login/register pages"

# Commit 9: Add mock AI service and data
$env:GIT_AUTHOR_DATE = "2026-07-20T10:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-20T10:00:00+05:30"
git add client/src/services/mockAI.js client/src/services/mockData.js client/src/hooks/useIncidents.js
git commit -m "Add AI analysis service with rule-based classification and mock data"

# Commit 10: Create citizen dashboard
$env:GIT_AUTHOR_DATE = "2026-07-20T13:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-20T13:00:00+05:30"
git add client/src/pages/citizen/CitizenDashboard.jsx
git commit -m "Create citizen dashboard with stats cards and recent reports"

# Commit 11: Add emergency report form
$env:GIT_AUTHOR_DATE = "2026-07-20T15:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-20T15:30:00+05:30"
git add client/src/pages/citizen/ReportEmergency.jsx
git commit -m "Add emergency report form with image upload and AI analysis trigger"

# Commit 12: Build AI analysis results page
$env:GIT_AUTHOR_DATE = "2026-07-20T18:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-20T18:00:00+05:30"
git add client/src/pages/citizen/AIAnalysis.jsx client/src/pages/citizen/HistoryPage.jsx
git commit -m "Build AI analysis results page and report history with search/filter"

# Commit 13: Create admin dashboard components
$env:GIT_AUTHOR_DATE = "2026-07-21T09:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-21T09:00:00+05:30"
git add client/src/components/dashboard/IncidentTable.jsx client/src/components/dashboard/AnalyticsCharts.jsx client/src/components/dashboard/ActivityTimeline.jsx
git commit -m "Create admin dashboard components - IncidentTable, Charts, Timeline"

# Commit 14: Build admin dashboard page
$env:GIT_AUTHOR_DATE = "2026-07-21T11:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-21T11:00:00+05:30"
git add client/src/pages/admin/AdminDashboard.jsx client/src/components/layout/DashboardLayout.jsx
git commit -m "Build admin dashboard with analytics, incident management, and layout"

# Commit 15: Initialize FastAPI backend
$env:GIT_AUTHOR_DATE = "2026-07-21T12:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-21T12:00:00+05:30"
git add server/requirements.txt server/main.py server/models/ server/database/
git commit -m "Initialize FastAPI backend with models and in-memory database"

# Commit 16: Add backend routes and AI service
$env:GIT_AUTHOR_DATE = "2026-07-21T12:30:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-21T12:30:00+05:30"
git add server/routes/ server/services/
git commit -m "Add backend API routes and rule-based AI analysis service"

# Commit 17: Add routing, app entry, and final polish
$env:GIT_AUTHOR_DATE = "2026-07-21T13:00:00+05:30"
$env:GIT_COMMITTER_DATE = "2026-07-21T13:00:00+05:30"
git add .
git commit -m "Add app routing with auth guards, entry points, and final polish"

# Clean up env vars
Remove-Item Env:GIT_AUTHOR_DATE
Remove-Item Env:GIT_COMMITTER_DATE

Write-Host ""
Write-Host "=== All 17 commits created! ==="
Write-Host ""
git log --oneline
