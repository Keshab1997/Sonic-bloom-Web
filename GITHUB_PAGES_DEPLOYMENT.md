# GitHub Pages Deployment Guide

## 🚀 Deploy to GitHub Pages

### Step 1: Update Repository Name
1. Open `vite.config.ts`
2. Change the `base` path from `/sonic-bloom/` to your repository name:
```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Build for Production
```bash
npm run build:gh-pages
```

### Step 4: Deploy to GitHub Pages
```bash
npm run deploy
```

## 🔧 Automatic Deployment

The repository includes GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when you push to the main branch.

### Setup Automatic Deployment:
1. Go to your GitHub repository
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"
4. Push to main branch to trigger deployment

## ⚠️ Limitations on GitHub Pages

GitHub Pages only serves static files, so some features may not work:

### Working Features:
- ✅ Local audio playback
- ✅ YouTube video embeds
- ✅ UI and player controls
- ✅ Local storage (favorites, settings)

### Limited Features:
- ❌ YouTube search (requires API key)
- ❌ Audio streaming from external APIs
- ❌ Server-side proxy functionality

### Alternative Solutions:
For full functionality, consider:
- Vercel (free tier available)
- Netlify (free tier available)
- GitHub Pages with backend service

## 🎯 Quick Deploy

```bash
# 1. Clone and setup
git clone YOUR_REPO_URL
cd sonic-bloom-web

# 2. Update repo name in vite.config.ts
# Change '/sonic-bloom/' to '/YOUR_REPO_NAME/'

# 3. Install and build
npm install
npm run build:gh-pages

# 4. Deploy
npm run deploy
```

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`