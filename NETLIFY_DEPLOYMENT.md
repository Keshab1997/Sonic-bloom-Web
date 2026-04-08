# Netlify Deployment Guide

## 🚀 Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
# অথবা
yarn global add netlify-cli
```

### Step 2: Login to Netlify
```bash
netlify login
```
- Browser এ login করুন

### Step 3: Build Command Setup
```bash
# Build command set করুন
netlify build --dir dist
```

### Step 4: Deploy করুন
```bash
# Development deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

## 🔧 Netlify Dashboard Setup

### Alternative: Git Integration
1. **GitHub Repository** connect করুন
2. **Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `18`

### Environment Variables (Optional)
```
ALLOWED_ORIGIN=https://your-netlify-site.netlify.app
```

## 🎯 Netlify Functions (Serverless)

### Step 1: Functions Folder তৈরি করুন
```
netlify/
  functions/
    youtube-search.js
    yt-stream.js
```

### Step 2: Function Files Copy করুন
```bash
# API folder থেকে functions এ copy করুন
cp api/*.ts netlify/functions/
```

### Step 3: Functions Deploy
```bash
netlify deploy --functions
```

## 📁 Project Structure for Netlify

```
sonic-bloom-web/
├── dist/                    # Build output
├── netlify/
│   └── functions/          # Serverless functions
├── public/
├── src/
├── api/                    # Original API files
├── package.json
└── netlify.toml           # Netlify config
```

## ⚙️ netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

## 🌐 Custom Domain (Optional)

### Step 1: Domain Add করুন
```bash
netlify domains:add yourdomain.com
```

### Step 2: DNS Settings Update করুন
- Netlify dashboard এর DNS settings follow করুন

## 🔄 Automatic Deploy

### GitHub Integration:
1. Repository → Settings → Webhooks
2. Netlify webhook add করুন
3. Push করলে automatically deploy হবে

## 📊 Netlify Features

- ✅ **Free Tier:** 100GB bandwidth, 100GB storage
- ✅ **Serverless Functions:** API endpoints
- ✅ **Form Handling:** Built-in forms
- ✅ **CDN:** Global content delivery
- ✅ **HTTPS:** Automatic SSL
- ✅ **Custom Domains:** Free SSL

## 🚀 Quick Deploy Commands

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize project
netlify init

# 4. Deploy
netlify deploy --prod
```

## 🎯 Advantages over GitHub Pages

- **Serverless Functions** - API routes work
- **Better Performance** - Global CDN
- **HTTPS by Default** - SSL included
- **Custom Domains** - Easy setup
- **Analytics** - Built-in stats

Your site will be available at: `https://your-site-name.netlify.app`