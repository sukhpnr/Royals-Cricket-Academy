# Vercel Deployment Guide

## 🚀 Complete Step-by-Step Setup for Vercel Deployment

This guide will help you deploy the Royals Cricket Academy project to Vercel with Supabase database integration.

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase account created and database set up
- [ ] Connection string ready: `postgresql://postgres:Sukhwinder@1979@db.jwkhdzzfotbmiwjsczdm.supabase.co:5432/postgres`
- [ ] GitHub repository has all files pushed
- [ ] `.env.example` file is in repository (sensitive data NOT in code)
- [ ] DATABASE_MIGRATIONS.md SQL queries executed in Supabase
- [ ] Vercel account created

---

## 🔑 Step 1: Prepare Environment Variables

Your Supabase connection details:
```
Host: db.jwkhdzzfotbmiwjsczdm.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: Sukhwinder@1979
```

Connection String:
```
postgresql://postgres:Sukhwinder@1979@db.jwkhdzzfotbmiwjsczdm.supabase.co:5432/postgres
```

---

## 🌐 Step 2: Connect Repository to Vercel

### Option A: Using Vercel Dashboard

1. Go to **[vercel.com](https://vercel.com)**
2. Sign in (or create account with GitHub)
3. Click **"Add New... → Project"**
4. Select **"Import Git Repository"**
5. Search for **"Royals-Cricket-Academy"**
6. Click **"Import"**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your local repository
vercel
```

---

## ⚙️ Step 3: Configure Environment Variables in Vercel

After connecting repository:

1. Go to **Project Settings**
2. Click **"Environment Variables"**
3. Add the following variables:

| Variable Name | Value | Environment |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:Sukhwinder@1979@db.jwkhdzzfotbmiwjsczdm.supabase.co:5432/postgres` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `NODE_ENV` | `development` | Development |
| `API_PORT` | `5000` | All |
| `CORS_ORIGIN` | `https://your-domain.com` | Production |

### How to Add Variables:

1. Click **"Add New"**
2. Enter **Variable Name** (e.g., `DATABASE_URL`)
3. Enter **Value** (your connection string)
4. Select **Environments** (Production, Preview, Development)
5. Click **"Save"**

---

## 📝 Step 4: Update vercel.json (Already Done ���)

Your `vercel.json` is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "artifacts/api-server/dist/index.mjs",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "artifacts/api-server/dist/index.mjs"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "pnpm run build",
  "outputDirectory": "artifacts/api-server/dist",
  "installCommand": "pnpm install"
}
```

---

## 🔨 Step 5: Deploy

### Automatic Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update configuration"
git push origin replit-agent
```

Vercel will:
1. ✅ Detect changes
2. ✅ Install dependencies with `pnpm install`
3. ✅ Build project with `pnpm run build`
4. ✅ Deploy to production
5. ✅ Generate deployment URL

### Manual Deployment

In Vercel Dashboard:
1. Go to **Deployments**
2. Click **"Redeploy"** on any deployment
3. Wait for build to complete

---

## 📊 Step 6: Verify Deployment

After deployment completes:

1. **Check Deployment URL**
   - Vercel provides: `https://royals-cricket-academy.vercel.app`
   - Your custom domain: `https://yourdomain.com`

2. **Test API Endpoints**
   ```bash
   curl https://royals-cricket-academy.vercel.app/api/health
   ```

3. **Check Database Connection**
   - Logs should show successful connection
   - No connection timeout errors

4. **View Build Logs**
   - Vercel Dashboard → Deployments → Click deployment → View logs

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Build Fails - pnpm not found
**Solution:**
1. Go to Project Settings
2. Set **"Package Manager"** to `pnpm`
3. Redeploy

### Issue 2: Database Connection Timeout
**Solution:**
1. Verify `DATABASE_URL` in environment variables
2. Check Supabase database is running (Status: Healthy)
3. Ensure password has no special characters that need escaping
4. Update connection string if password changed

### Issue 3: Module Not Found Error
**Solution:**
```bash
# Locally run build to test
pnpm run build

# If it fails locally, fix before pushing
git push origin replit-agent
```

### Issue 4: 502 Bad Gateway
**Solution:**
1. Check Vercel deployment logs
2. Ensure API server starts correctly
3. Verify environment variables are set
4. Check for runtime errors in logs

---

## 🔒 Step 7: Security Best Practices

### ✅ Do's:
- ✅ Use environment variables for all secrets
- ✅ Never commit `.env` or `.env.local` files
- ✅ Use strong database password (already set ✓)
- ✅ Enable RLS (Row Level Security) in Supabase
- ✅ Regularly update dependencies

### ❌ Don'ts:
- ❌ Never push passwords to GitHub
- ❌ Don't commit connection strings to repository
- ❌ Don't expose API keys in frontend code
- ❌ Don't use weak passwords

---

## 📈 Step 8: Monitoring & Logs

### View Logs in Vercel:

1. Go to **Deployments**
2. Click on active deployment
3. Click **"Function Logs"** or **"Runtime Logs"**

### Monitor Performance:

1. Go to **Analytics**
2. Track API response times
3. Monitor bandwidth usage

---

## 🔄 Step 9: Continuous Integration

Every push to `replit-agent` branch triggers:

```
Git Push → GitHub → Vercel Detects Changes → 
Build → Test → Deploy → Live!
```

---

## 📱 Step 10: Custom Domain (Optional)

1. Go to Project Settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records with Vercel settings
5. Wait 24-48 hours for propagation

---

## 🎉 Deployment Complete!

Your project is now live on Vercel! 

**Your API URL:** `https://royals-cricket-academy.vercel.app`

**Database:** Connected to Supabase (PostgreSQL)

---

## 📞 Support & Debugging

If you face issues:

1. **Check Vercel Logs:** Deployments → Runtime Logs
2. **Check Supabase Status:** Dashboard → Status
3. **Verify Environment Variables:** Settings → Environment Variables
4. **Test Locally:** `pnpm run dev`

---

## 🚀 Next Steps

1. ✅ Database tables created in Supabase
2. ✅ Environment variables configured
3. ✅ Deployed to Vercel
4. ✅ API endpoints live

**Start building your frontend!** 💪

