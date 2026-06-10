# Blockchain Doctor Appointment System - Vercel Deployment Guide

## Pre-Deployment Checklist

- [x] Project builds successfully (`pnpm build`)
- [x] All 11 pages created and tested
- [x] Database connected (Neon PostgreSQL)
- [x] Environment variables configured
- [x] Smart contract deployed (if using payments)
- [x] MetaMask integration ready
- [x] Real-time features working

## Step 1: Prepare GitHub Repository

### Option A: Connect Existing GitHub Repository

If your project is already on GitHub:
```bash
cd /vercel/share/v0-project
git remote -v  # Check current remote
git push origin main  # Push latest changes
```

### Option B: Create New GitHub Repository

```bash
cd /vercel/share/v0-project

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Blockchain doctor appointment system"

# Create repository on GitHub
# Then:
git remote add origin https://github.com/yourusername/doctor-appointment-blockchain.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel Using CLI

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Navigate to project
cd /vercel/share/v0-project

# Deploy to Vercel
vercel

# Follow prompts:
# - Link to existing project or create new one
# - Choose project settings
# - Confirm deployment
```

### Option B: Connect via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Configure settings (see below)
5. Click "Deploy"

## Step 3: Configure Environment Variables in Vercel

### In Vercel Dashboard:

1. Go to your project settings
2. Click "Environment Variables"
3. Add the following variables:

```
DATABASE_URL
  Value: postgresql://[your-neon-connection-string]
  Environments: Production, Preview, Development

BETTER_AUTH_SECRET
  Value: [your-generated-secret]
  Environments: Production, Preview, Development

NEON_AUTH_COOKIE_SECRET
  Value: [your-generated-secret]
  Environments: Production, Preview, Development

NEXT_PUBLIC_ETHEREUM_RPC_URL
  Value: https://eth-mainnet.alchemyapi.io/v2/[your-alchemy-key]
  Environments: Production, Preview, Development

NEXT_PUBLIC_CONTRACT_ADDRESS
  Value: 0x[your-deployed-contract-address]
  Environments: Production, Preview, Development
```

### Important: Public Variables

Mark these as public (they're safe to expose):
- `NEXT_PUBLIC_ETHEREUM_RPC_URL`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`

All other variables should be private (server-side only).

## Step 4: Database Configuration

### Neon PostgreSQL is Already Connected

Your Neon database is already connected through Vercel integrations.

**Verify connection:**
1. Go to project Settings
2. Click "Integrations"
3. Confirm Neon is listed

### Initialize Database on First Deploy

The `DatabaseInitializer` component will automatically:
1. Create all tables on first request
2. Seed 16 medical specialties
3. Create necessary indexes

**This happens automatically - no manual SQL needed!**

## Step 5: Deployment Monitoring

### After Clicking Deploy:

1. **Building** (2-3 minutes)
   - Vercel installs dependencies
   - Runs `pnpm build`
   - Creates optimized bundle

2. **Function Initialization** (30 seconds)
   - API routes deployed
   - Database functions ready
   - Static assets cached

3. **Live** (1-2 minutes)
   - Your app is live!
   - Check logs at https://vercel.com/yourusername/project/logs

### View Deployment Logs:

```bash
vercel logs [your-project-name] --follow
```

## Step 6: Test Deployment

### Test Live App:

1. **Go to your deployment URL**
   - Format: `https://doctor-appointment-blockchain.vercel.app`
   - Or your custom domain

2. **Test database initialization**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Check for successful `/api/init-db` call
   - Look for response: `"message": "Database initialized"`

3. **Test registration**
   - Click "Register"
   - Connect MetaMask
   - Enter name and select role
   - Should create user in database

4. **Test real-time features**
   - Open app in two browsers
   - Register doctor in one
   - Book appointment as patient in other
   - Verify real-time updates

5. **Test MetaMask integration**
   - Registration and login work
   - Settings page shows current wallet
   - Can change wallet successfully

## Step 7: Custom Domain (Optional)

### Add Custom Domain:

1. Go to project Settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records at your domain provider
5. Wait for verification (can take up to 48 hours)

**Example:**
- Domain: `doctor-appointments.com`
- Vercel will provide CNAME record
- Add to your DNS provider

## Step 8: Enable Analytics (Optional)

### Vercel Web Analytics:

```bash
# Already installed, just enable in Vercel dashboard
# No code changes needed!
```

**View analytics at:**
- https://vercel.com/yourusername/project/analytics

## Step 9: Configure Production Settings

### In Vercel Dashboard → Settings:

1. **Build & Development Settings**
   - Build Command: `pnpm build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `pnpm install` (default)

2. **Node.js Version**
   - Recommended: 20.x or 22.x

3. **Environment Preset**
   - Select: "Node.js"

4. **Git Configuration**
   - Production Branch: `main`
   - Automatic Deployments: Enabled

## Step 10: Set Up Auto Deployments

### Vercel auto-deploys when:

1. You push to main branch
   ```bash
   git push origin main  # Auto-deploys to production
   ```

2. You create a pull request
   - Vercel creates preview deployment
   - See live preview of changes
   - Merge PR to deploy to production

## Troubleshooting Deployment

### Issue: Build Fails

**Check logs:**
```bash
vercel logs [project-name] --follow
```

**Common issues:**
- Missing environment variable: Add to Vercel Dashboard
- TypeScript error: Run `pnpm build` locally first
- Dependency issue: Check `package.json` is correct

### Issue: Database Not Initializing

**Check:**
1. `DATABASE_URL` is set in environment
2. Neon database is online
3. Check browser console for `/api/init-db` errors
4. Vercel logs for backend errors

### Issue: MetaMask Not Connecting

**Check:**
1. `NEXT_PUBLIC_ETHEREUM_RPC_URL` is set
2. RPC URL is valid and accessible
3. MetaMask extension is installed
4. Browser console shows no CORS errors

### Issue: Real-Time Updates Slow

**This is normal** - app uses 10-second polling, not WebSockets

**To optimize:**
1. Check database query performance
2. Consider caching for frequently accessed data
3. Monitor Vercel analytics for slow endpoints

## Post-Deployment

### Monitor Performance:

1. **Vercel Analytics**
   - Core Web Vitals
   - Response times
   - Error rates

2. **Browser Console Errors**
   - Check for MetaMask errors
   - Check for database errors
   - Check for API errors

3. **Database Performance**
   - Monitor Neon dashboard
   - Check query logs
   - Optimize slow queries

### Backup Strategy:

```bash
# Regular backups of Neon database
# Neon handles automatic backups
# You can also export data:
```

**In Neon Dashboard:**
1. Click "Backups"
2. Create manual backup
3. Download if needed

## Update Deployment

### Deploy New Changes:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main  # Auto-deploys!

# Or manually:
vercel --prod
```

### Rollback to Previous Version:

1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous deployment
4. Click "Promote to Production"

## Production Checklist Before Going Live

- [ ] All environment variables set correctly
- [ ] Database initialized and working
- [ ] MetaMask integration tested
- [ ] Doctor registration tested
- [ ] Patient registration tested
- [ ] Appointment booking tested
- [ ] Real-time updates working
- [ ] Wallet change feature working
- [ ] Smart contract address configured
- [ ] Payment flow tested (if enabled)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics enabled (optional)
- [ ] Monitoring alerts set up (optional)

## Security Checklist

- [ ] No secrets in `package.json` or `.env.example`
- [ ] All sensitive variables in Vercel (not in code)
- [ ] Database access restricted by IP (if available)
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] API rate limiting considered
- [ ] Input validation in all endpoints
- [ ] CORS properly configured
- [ ] Signature verification working for MetaMask

## Scaling for Production

### When You Need More Power:

1. **Neon Database**
   - Upgrade plan for more compute
   - Add read replicas for scaling reads
   - Configure connection pooling

2. **Vercel Serverless Functions**
   - Automatically scales
   - No manual configuration needed
   - Pay only for what you use

3. **Content Delivery**
   - Vercel CDN distributes content
   - Already optimized
   - No additional setup needed

## Next Steps After Deployment

1. **Monitor the first 24 hours**
   - Watch error logs
   - Check performance metrics
   - Test key user flows

2. **Set up alerts**
   - Email alerts for errors
   - Slack integration (optional)
   - Response time alerts

3. **Plan future improvements**
   - WebSocket upgrades (from polling)
   - Additional specialties
   - Insurance integration
   - Video call scheduling

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Neon Docs**: https://neon.tech/docs
- **MetaMask Docs**: https://docs.metamask.io

---

**Your app is now deployed and live on Vercel!**

Access it at: `https://[your-project-name].vercel.app`

