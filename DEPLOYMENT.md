# Horizon Student Success System - Deployment Guide

## Deploying to Vercel

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

### Method 3: Deploy from GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel handles the rest automatically

## Environment Variables (if needed)

If you add Supabase or other integrations:
- Add environment variables in Vercel Dashboard → Settings → Environment Variables
- Prefix with `VITE_` for client-side variables

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Build Configuration

The project uses:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Post-Deployment

After deployment, you'll receive a URL like:
- `https://your-project.vercel.app`

Share this URL for your assignment submission.
