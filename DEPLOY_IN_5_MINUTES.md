# Deploy to Vercel in 5 Minutes

## Ultra-Quick Start

### Step 1: Install Vercel CLI (1 min)
```bash
npm i -g vercel
```

### Step 2: Login to Vercel (1 min)
```bash
vercel login
# Opens browser for authentication
```

### Step 3: Deploy (1 min)
```bash
cd /vercel/share/v0-project
vercel
```

When prompted:
- **Set up and deploy?** → `y` (yes)
- **Link to existing project?** → `n` (no, create new)
- **Project name?** → `doctor-appointment-blockchain` (or your choice)
- **Directory?** → `.` (current directory)

### Step 4: Set Environment Variables (2 min)

After deployment, you'll get a URL like: `https://doctor-appointment-blockchain.vercel.app`

Go to Vercel Dashboard and add variables:

```
DATABASE_URL=postgresql://[your-neon-url]
BETTER_AUTH_SECRET=[your-secret]
NEON_AUTH_COOKIE_SECRET=[your-secret]
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/[your-key]
NEXT_PUBLIC_CONTRACT_ADDRESS=0x[your-contract]
```

### Step 5: Test It! (Instant)

Open: `https://doctor-appointment-blockchain.vercel.app`

✅ Done! Your app is live!

---

## If You Use GitHub

Easier approach:

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Select your GitHub repo
# 5. Add environment variables
# 6. Click "Deploy"

# Done!
```

---

## Verify Deployment Works

1. Open app in browser
2. Register as patient with MetaMask
3. See dashboard with doctors
4. Go to Settings - should show wallet address
5. ✅ Everything working!

---

## Environment Variables Guide

You need these secrets - **never share them!**

### Get DATABASE_URL from Neon:
1. Go to https://console.neon.tech
2. Select project
3. Click "Connection string"
4. Copy and paste into Vercel

### Generate BETTER_AUTH_SECRET:
```bash
openssl rand -base64 32
```

### Generate NEON_AUTH_COOKIE_SECRET:
```bash
openssl rand -base64 32
```

### Get ETHEREUM_RPC_URL from Alchemy:
1. Go to https://www.alchemy.com
2. Create app for Ethereum Mainnet
3. Copy HTTP URL

### Get CONTRACT_ADDRESS:
See `SMART_CONTRACT_DEPLOY.md` for deploying smart contract

---

## That's It!

Your blockchain doctor appointment system is now live on Vercel!

Share your URL: `https://doctor-appointment-blockchain.vercel.app`

For detailed guide, see `VERCEL_DEPLOYMENT.md`
