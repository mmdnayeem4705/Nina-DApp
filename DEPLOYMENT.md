# Deployment Guide - Doctor Appointment Booking System

## 🚀 Quick Start Deployment

This guide walks through deploying the Doctor Appointment Booking System to production.

---

## Phase 1: Smart Contract Deployment

### Option A: Using Remix IDE (Recommended for Beginners)

1. **Go to Remix IDE**
   - Visit: https://remix.ethereum.org/

2. **Create Contract File**
   - Click "Create New File"
   - Name: `DoctorAppointmentPayment.sol`
   - Copy content from `/contracts/DoctorAppointmentPayment.sol`

3. **Compile Contract**
   - Left panel → Solidity Compiler
   - Compiler version: 0.8.20 or higher
   - Click "Compile DoctorAppointmentPayment.sol"

4. **Deploy Contract**
   - Left panel → Deploy & run transactions
   - Environment: "Injected Provider" (MetaMask)
   - Make sure MetaMask is set to Ethereum Mainnet
   - Connected account has ETH for gas
   - Click "Deploy"
   - Approve transaction in MetaMask

5. **Copy Contract Address**
   - After deployment, copy the address shown
   - Format: `0x...` (42 characters)
   - Save this for `.env.local`

### Option B: Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat

# Initialize project
npx hardhat init
# Select "Create advanced sample project"

# Copy contract to contracts/DoctorAppointmentPayment.sol

# Create deploy script (scripts/deploy.js)
async function main() {
  const Contract = await ethers.getContractFactory("DoctorAppointmentPayment");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# Deploy
npx hardhat run scripts/deploy.js --network mainnet
```

### Verify Contract on Etherscan

After deployment:

1. **Go to Etherscan**
   - https://etherscan.io/

2. **Find Your Contract**
   - Paste your contract address
   - Click "Contract" tab

3. **Verify Source Code**
   - Click "Verify and Publish"
   - Compiler type: Solidity
   - Compiler version: 0.8.20 (match your deployment)
   - Optimization: Yes
   - Paste contract code
   - Click "Verify and Publish"

**Benefits:**
- Public can see contract code
- Users can verify functionality
- Increases trust

---

## Phase 2: Environment Configuration

### 1. Generate Secrets

```bash
# Generate BETTER_AUTH_SECRET
openssl rand -base64 32
# Output: abc123def456... (save this)

# Generate NEON_AUTH_COOKIE_SECRET
openssl rand -base64 32
# Output: xyz789uvw012... (save this)
```

### 2. Get Ethereum RPC URL

**Option A: Infura**
- Visit: https://infura.io/
- Sign up (free)
- Create new project
- Select "Ethereum" → "Mainnet"
- Copy HTTP URL from "Endpoints"
- Format: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

**Option B: Alchemy**
- Visit: https://www.alchemy.com/
- Sign up (free tier available)
- Create app for Ethereum Mainnet
- Copy HTTP URL
- Paste in environment

### 3. Create .env.local

```env
# Database (from Neon - see below)
DATABASE_URL=postgresql://user:password@host/dbname

# Authentication Secrets
BETTER_AUTH_SECRET=<your-generated-secret-1>
NEON_AUTH_COOKIE_SECRET=<your-generated-secret-2>

# Ethereum Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x<your-deployed-contract-address>
```

---

## Phase 3: Database Setup

### Neon PostgreSQL

1. **Create Neon Account**
   - Visit: https://console.neon.tech/
   - Sign up with email or GitHub

2. **Create Project**
   - Click "New Project"
   - Name: "doctor-appointment-system"
   - Choose free tier (sufficient for MVP)

3. **Get Connection String**
   - Dashboard → Connection string
   - Copy PostgreSQL URI
   - Format: `postgresql://user:password@host/dbname`

4. **Update .env.local**
   ```env
   DATABASE_URL=postgresql://user:password@host/dbname
   ```

5. **Verify Connection**
   ```bash
   psql "postgresql://user:password@host/dbname" -c "SELECT 1;"
   # Should output: 1
   ```

**Database Schema:**
- Drizzle ORM automatically creates tables
- Schema defined in `/db/schema.ts`
- No manual migration needed for initial setup

---

## Phase 4: Local Testing Before Deployment

### 1. Install Dependencies
```bash
cd /path/to/project
pnpm install
```

### 2. Create .env.local
See Phase 2 above

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Test Complete Flow
- [ ] Register as patient (MetaMask)
- [ ] Register as doctor (MetaMask)
- [ ] Browse doctors by specialty
- [ ] Book appointment
- [ ] Process payment (check gas fees)
- [ ] View confirmation
- [ ] Doctor approves appointment
- [ ] Patient sees status update
- [ ] Register organ donation

### 5. Verify Database
```bash
# Connect to Neon database
psql "your-database-url"

# Check tables
\dt

# Sample queries
SELECT * FROM users;
SELECT * FROM appointments;
```

---

## Phase 5: Vercel Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Doctor appointment system"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/repo.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel

**Method A: Vercel Dashboard**
1. Go to https://vercel.com/
2. Click "Add New..." → "Project"
3. Select GitHub repo
4. Click "Import"

**Method B: Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

### 3. Configure Environment Variables

In Vercel Dashboard:

1. Project Settings → Environment Variables
2. Add variables:
   ```
   DATABASE_URL = postgresql://...
   BETTER_AUTH_SECRET = (generated value)
   NEON_AUTH_COOKIE_SECRET = (generated value)
   NEXT_PUBLIC_ETHEREUM_RPC_URL = https://mainnet.infura.io/v3/...
   NEXT_PUBLIC_CONTRACT_ADDRESS = 0x...
   ```

3. Click "Save"

**Important Notes:**
- `NEXT_PUBLIC_*` variables are public (safe for frontend)
- Other variables are private (backend only)
- Add same variables for "Preview" and "Production" environments

### 4. Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch if connected to GitHub
git push origin main
# Vercel will auto-deploy
```

**First Deploy:**
- Automatic build: ~2-3 minutes
- Check build logs for errors
- Deployment will fail if env vars missing

### 5. Verify Deployment

```bash
# After successful deployment, visit your URL
https://your-project.vercel.app

# Check:
- [ ] Login page loads
- [ ] MetaMask connection works
- [ ] Can register new users
- [ ] Doctor/patient pages accessible
- [ ] API routes responding
```

---

## Phase 6: Post-Deployment Checklist

### Security
- [ ] All env vars configured in Vercel
- [ ] Smart contract verified on Etherscan
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Database backups enabled (Neon)
- [ ] Session secrets are strong random strings

### Performance
- [ ] Monitor build time (should be <5 min)
- [ ] Check page load speed (< 3 seconds)
- [ ] Verify API response times (< 200ms)
- [ ] Monitor database connection errors

### Database
- [ ] Neon backups enabled
- [ ] Database monitoring set up
- [ ] Query performance checked
- [ ] Connection pool configured

### Monitoring & Logging
- [ ] Error logging configured
- [ ] Analytics dashboard viewed
- [ ] Database query logs checked
- [ ] Smart contract events monitored

### Documentation
- [ ] Contract address documented
- [ ] Database credentials secured
- [ ] Deployment checklist saved
- [ ] Runbook created for troubleshooting

---

## Troubleshooting Deployment Issues

### Build Fails
```bash
# Check for TypeScript errors
pnpm build

# Check for missing env vars
echo $NEXT_PUBLIC_CONTRACT_ADDRESS
echo $DATABASE_URL

# Common cause: Missing env variables in Vercel
# Solution: Add all vars to Vercel Settings → Environment Variables
```

### Database Connection Error
```
Error: connect ECONNREFUSED
```
- [ ] DATABASE_URL is correct
- [ ] Neon database is running
- [ ] IP whitelist configured (if applicable)
- [ ] Test connection locally first

### MetaMask Not Working
- [ ] Verify RPC URL is correct
- [ ] Check network is Mainnet
- [ ] Test RPC URL: `curl -X POST <RPC_URL>`
- [ ] Clear browser cache and cookies

### Payment Errors
- [ ] Contract deployed to correct network
- [ ] Contract address matches env var
- [ ] Wallet has sufficient ETH
- [ ] Gas limit is sufficient

### Smart Contract Not Found
```
Error: call revert exception (address=0x..., ...)
```
- [ ] Contract address is correct
- [ ] Contract deployed to same network
- [ ] Contract source code matches deployment

---

## Scaling for Production

### As User Base Grows

**Database:**
- Switch to Neon Pro tier for higher limits
- Add read replicas for queries
- Implement query caching with Redis

**Smart Contract:**
- Consider multi-chain deployment
- Implement DAO governance
- Add oracle for real-time pricing

**API:**
- Add rate limiting
- Implement caching layer
- Monitor and optimize slow endpoints

**Frontend:**
- Implement CDN for assets
- Enable image optimization
- Consider edge caching

### Cost Optimization

**Estimates (Monthly):**
- Neon Database: $0-29 (free → pro)
- Vercel Hosting: $0-50 (free → pro)
- Infura RPC: $0-30 (free → paid)
- Infrastructure: $30-100 total

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Website loads without errors
- [ ] MetaMask connection works
- [ ] Database responding normally
- [ ] No build failures

### Weekly Checks
- [ ] Review error logs
- [ ] Check database performance
- [ ] Monitor API response times
- [ ] Review security logs

### Monthly Tasks
- [ ] Update dependencies
- [ ] Test disaster recovery
- [ ] Review and optimize queries
- [ ] Backup database manually

---

## Rollback Procedure

If something breaks:

```bash
# Vercel: Auto-rollback to previous deployment
# Go to Dashboard → Deployments
# Click on previous deployment
# Click "Promote to Production"

# Or revert GitHub commit
git revert HEAD
git push origin main
# Vercel will re-deploy
```

---

## Support & Help

If deployment issues:

1. **Check Vercel Logs**
   - Dashboard → Deployments → Logs
   - Look for error messages

2. **Check Build Output**
   - Dashboard → Deployments → Build Logs
   - See compilation errors

3. **Review Environment**
   - Settings → Environment Variables
   - Verify all variables present

4. **Test Locally**
   - `pnpm dev` locally first
   - Verify with same env vars

5. **Restart Deployment**
   ```bash
   vercel --prod --force
   ```

---

## Successful Deployment Signs ✓

- [ ] Website loads at vercel.app URL
- [ ] MetaMask connects without errors
- [ ] User registration/login works
- [ ] Doctor/patient dashboards visible
- [ ] API requests return 200 status
- [ ] Database has user records
- [ ] No build errors in logs
- [ ] Pages load in < 3 seconds

---

## Next Steps After Deployment

1. **Share with Users**
   - Send deployment URL
   - Include SETUP instructions

2. **Gather Feedback**
   - Monitor error logs
   - Collect user feedback
   - Iterate on features

3. **Scale Infrastructure**
   - Monitor database performance
   - Upgrade tiers as needed
   - Consider multi-region deployment

4. **Add Features**
   - Video consultations
   - Push notifications
   - Advanced analytics

---

Congratulations! Your Doctor Appointment System is now live! 🎉

For questions, see PROJECT_SUMMARY.md and SETUP.md
