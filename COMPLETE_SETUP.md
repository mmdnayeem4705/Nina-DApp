# Complete Setup Guide - Doctor Appointment Blockchain System

This is your complete guide to set up, deploy, and test the Doctor Appointment Blockchain system. Follow these steps sequentially.

---

## Overview

This system combines:
- **Frontend**: Next.js 16 with React for patient and doctor dashboards
- **Backend**: Node.js API routes with Drizzle ORM
- **Database**: Neon PostgreSQL (already connected)
- **Blockchain**: Ethereum smart contracts for payments
- **Authentication**: MetaMask wallet-based login
- **Real-time**: Database polling (10-second updates)

---

## Total Setup Time: ~30 minutes

---

# STEP 1: Prepare Your Environment (5 minutes)

## 1.1 Generate Cryptographic Secrets

Open your terminal and run these commands:

```bash
# Command 1: Generate BETTER_AUTH_SECRET
openssl rand -base64 32

# Copy the output and save it somewhere
# Example output: gH7mK9nL2pQ5rS8tU1vW4xY7zB0cD3eF6gH9iJ=

# Command 2: Generate NEON_AUTH_COOKIE_SECRET
openssl rand -base64 32

# Copy this output too
```

**⚠️ Save both outputs - you'll need them in Step 3.**

---

## 1.2 Choose Your Blockchain Network

**For Testing (Recommended - FREE):**
- Network: Sepolia Testnet
- RPC URL: `https://rpc.sepolia.dev`
- Cost: FREE (test ETH from faucet)
- Use this first for development!

**For Production (Real Payments):**
- Network: Ethereum Mainnet
- RPC URL: Get from Infura/Alchemy (costs money)
- Cost: Real ETH required
- Only after testing!

---

# STEP 2: Deploy Smart Contract (5-10 minutes)

## 2.1 Deploy Using Remix IDE (Easiest)

1. Open https://remix.ethereum.org/

2. Create new file: Right-click file explorer → New File → `DoctorAppointmentPayment.sol`

3. Copy contract code:
   - Go to: `/vercel/share/v0-project/contracts/DoctorAppointmentPayment.sol`
   - Copy entire code
   - Paste into Remix

4. Compile:
   - Click Solidity Compiler (left sidebar)
   - Set version to 0.8.19
   - Click "Compile DoctorAppointmentPayment.sol"
   - Should see green checkmark ✓

5. Deploy to Sepolia:
   - Click "Deploy & Run Transactions"
   - Environment: "Injected Provider - MetaMask"
   - Ensure MetaMask is on **Sepolia** network
   - Click blue "Deploy" button
   - Confirm in MetaMask popup

6. Get Free Test ETH:
   - Go to https://sepoliafaucet.com
   - Enter your wallet address
   - Get ~0.05 Sepolia ETH (takes a minute)
   - Come back to Remix

7. Complete Deployment:
   - Click "Deploy"
   - Confirm transaction
   - Wait 15-30 seconds for confirmation
   - Check Remix "Deployed Contracts" section
   - **Copy the contract address** (0x123...)

**⚠️ Save contract address - you'll need it in Step 3.**

---

## 2.2 Verify Contract (Optional but Recommended)

After deployment:
1. Go to https://sepolia.etherscan.io
2. Search for your contract address
3. You should see the contract details and recent deployment
4. Save the Etherscan URL

---

# STEP 3: Create Environment Configuration (3 minutes)

## 3.1 Get Database URL

Your Neon PostgreSQL database is already connected! Find it:

1. Go to v0 Settings (top right) → Vars
2. Look for `DATABASE_URL`
3. Copy the entire URL (it's long)
4. It will look like: `postgresql://user:password@...`

**⚠️ Save this URL - you'll need it now.**

---

## 3.2 Create .env.local File

In your project root directory, create a new file named `.env.local` (exactly this name).

Add this content:

```env
# Neon Database (from Step 3.1)
DATABASE_URL=postgresql://user:password@host/database

# Secrets (from Step 1.1)
BETTER_AUTH_SECRET=paste_your_openssl_output_here
NEON_AUTH_COOKIE_SECRET=paste_your_openssl_output_here

# Ethereum Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://rpc.sepolia.dev
NEXT_PUBLIC_CONTRACT_ADDRESS=0xpaste_your_contract_address_here

# Network Selection (for reference)
# NEXT_PUBLIC_NETWORK=sepolia
```

**Replace these placeholders:**
- `postgresql://user:password@...` → Your actual DATABASE_URL
- `paste_your_openssl_output_here` → Your generated secrets
- `0xpaste_your_contract_address_here` → Your contract address

**Example (DO NOT USE - JUST FOR REFERENCE):**
```env
DATABASE_URL=postgresql://user123:pass456@ep-cool-wave-12345.us-east-1.postgres.vercel-storage.com/dbname
BETTER_AUTH_SECRET=gH7mK9nL2pQ5rS8tU1vW4xY7zB0cD3eF6gH9iJ=
NEON_AUTH_COOKIE_SECRET=aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3=
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://rpc.sepolia.dev
NEXT_PUBLIC_CONTRACT_ADDRESS=0x4e59b44847b379578588920ca78fbf26c0b4956c
```

---

## 3.3 Verify Environment File

Check that `.env.local`:
- [ ] Is in the root directory (same level as package.json)
- [ ] Contains all 5 variables
- [ ] No typos in variable names
- [ ] Values don't have quotes around them
- [ ] File is saved

---

# STEP 4: Start Development Server (2 minutes)

## 4.1 Install Dependencies (If First Time)

```bash
cd /vercel/share/v0-project
pnpm install
```

Wait for all packages to install (1-2 minutes).

## 4.2 Start Dev Server

```bash
pnpm dev
```

You should see:
```
> Ready in 2.3s
> Local:        http://localhost:3000
> Environments: .env.local
```

**✅ Your development server is running!**

---

# STEP 5: Test the System (5-10 minutes)

## 5.1 Open the App

1. Open http://localhost:3000 in your browser
2. You should see:
   - "Doctor Appointment System" title
   - "Register" button
   - Login form

## 5.2 Test Patient Registration

1. Click **"Register"**
2. Click **"Connect MetaMask Wallet"**
3. MetaMask popup appears → Click **"Next"** → **"Connect"**
4. You're connected (shows wallet address)
5. Select **"Patient"**
6. Enter name: "Test Patient"
7. Click **"Register"**
8. Sign message in MetaMask (click "Sign")
9. **✅ You're now logged in as a patient!**

## 5.3 Explore Patient Features

1. You should see the patient dashboard
2. Look for "Browse Doctors" or doctor list
3. Click on any doctor
4. You should see an appointment booking form
5. Fill in form:
   - Name: "Test Patient"
   - Age: "30"
   - Gender: "Male"
   - Blood Group: "O+"
   - Symptoms: "Test symptoms"
6. Click "Proceed to Payment"
7. A payment modal should appear showing:
   - Doctor's wallet address
   - Consultation fee
8. Click "Proceed to MetaMask"
9. MetaMask popup opens with transaction details
10. **Verify the amount matches** the consultation fee
11. Click "Confirm" in MetaMask
12. **✅ Payment processed and appointment created!**

## 5.4 Test Doctor View

1. Logout or open private/incognito window
2. Register as doctor (different wallet address):
   - Click Register
   - Connect different MetaMask account
   - Select "Doctor"
   - Enter name: "Dr. Test"
3. You should see doctor dashboard
4. Look for appointment requests from the patient
5. If not visible, refresh page (real-time polling takes up to 10 seconds)
6. Click on the appointment
7. You should see patient details:
   - Name, age, gender
   - Symptoms, allergies, blood group
8. Click "Approve" or "Reject"
9. Switch back to patient window
10. Patient's status should update within 10 seconds
11. **✅ Real-time updates working!**

---

# STEP 6: Complete Feature Testing (See TESTING.md)

Once everything works, run through the comprehensive test suite:

```bash
# Read the full testing guide
cat TESTING.md
```

Test checklist:
- [ ] Patient registration and login
- [ ] Doctor registration and login
- [ ] Browse doctors by specialty
- [ ] Complete appointment booking
- [ ] Payment with MetaMask
- [ ] Doctor approves/rejects
- [ ] Real-time status updates
- [ ] Organ donation form
- [ ] Doctor profile management

---

# STEP 7: Deploy to Production (Optional)

See **DEPLOYMENT.md** for complete production setup:

```bash
cat DEPLOYMENT.md
```

Key steps:
1. Connect GitHub repository
2. Deploy to Vercel
3. Configure production environment variables
4. Update RPC to Mainnet (optional)
5. Deploy contract to Mainnet (costs real ETH)

---

# Troubleshooting

## Registration Fails

**Problem:** "Registration failed" error

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Ensure MetaMask is unlocked
3. Check `.env.local` exists and has all variables
4. Restart dev server: `pnpm dev`
5. Try private/incognito window

## MetaMask Won't Connect

**Problem:** Can't connect wallet

**Solutions:**
1. Ensure MetaMask is installed
2. Unlock MetaMask in browser
3. Check if browser extension is enabled
4. Reload page
5. Try different browser

## Payment Fails

**Problem:** "Transaction failed" or "Insufficient balance"

**Solutions:**
1. Ensure you have Sepolia ETH (visit faucet)
2. Verify contract address in `.env.local`
3. Check network is Sepolia in MetaMask
4. Verify RPC URL in `.env.local`
5. Try smaller amount

## Real-Time Updates Slow

**Problem:** Appointments don't update immediately

**Solutions:**
1. This is normal - polling every 10 seconds by design
2. Manual refresh available on dashboards
3. For production, can upgrade to WebSockets (see DEPLOYMENT.md)

## Database Connection Error

**Problem:** "Database connection failed"

**Solutions:**
1. Verify DATABASE_URL in `.env.local`
2. Check Neon integration is connected
3. Ensure URL has no extra spaces
4. Restart dev server after fixing

---

# Quick Reference

## Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Your environment variables (DO NOT COMMIT) |
| `/contracts/DoctorAppointmentPayment.sol` | Smart contract source |
| `/app/api/auth/` | Authentication routes |
| `/app/patient/` | Patient pages |
| `/app/doctor/` | Doctor pages |
| `/db/schema.ts` | Database schema |

## Key Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Check code quality
```

## Important URLs

- **Local App**: http://localhost:3000
- **Remix IDE**: https://remix.ethereum.org
- **Sepolia Faucet**: https://sepoliafaucet.com
- **Sepolia Block Explorer**: https://sepolia.etherscan.io
- **Mainnet Block Explorer**: https://etherscan.io

---

# Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│              /patient  /doctor  /api/auth               │
└──────────────────┬────────────────────────────────────┘
                   │
┌──────────────────┴────────────────────────────────────┐
│              API Routes & Database                     │
│  • Authentication  • Appointments  • Payments          │
│  • Doctor Profiles • Organ Donation                    │
└──────────────────┬────────────────────────────────────┘
                   │
┌──────────────────┴────────────────────────────────────┐
│        Neon PostgreSQL Database (Connected)           │
│  • Users  • Doctors  • Appointments  • Payments        │
└──────────────────┬────────────────────────────────────┘
                   │
┌──────────────────┴────────────────────────────────────┐
│          Ethereum Blockchain (Smart Contract)         │
│     Payment Processing & On-Chain Verification        │
└─────────────────────────────────────────────────────────┘
```

---

# Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never share `BETTER_AUTH_SECRET`
- [ ] Test on Sepolia before Mainnet
- [ ] Use strong wallet passwords
- [ ] Verify contract address before transactions
- [ ] Monitor smart contract on Etherscan
- [ ] Don't expose private keys
- [ ] Keep dependencies updated

---

# Next Steps After Setup

1. **Read Documentation**:
   - `QUICKSTART.md` - Quick reference
   - `TESTING.md` - Full test procedures
   - `PROJECT_SUMMARY.md` - Architecture details

2. **Test Everything** (See TESTING.md):
   - All patient features
   - All doctor features
   - Error handling
   - Real-time updates

3. **Deploy** (See DEPLOYMENT.md):
   - Push to GitHub
   - Deploy to Vercel
   - Configure domain
   - Set up monitoring

4. **Monitor**:
   - Check Etherscan for transactions
   - Monitor database performance
   - Track user activity

---

# Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Ethers.js Docs**: https://docs.ethers.org
- **MetaMask Docs**: https://docs.metamask.io
- **Solidity Docs**: https://docs.soliditylang.org

---

## Success! 🎉

If you've completed all steps:
- ✅ Development server running
- ✅ Database connected
- ✅ Smart contract deployed
- ✅ Patient can register and book
- ✅ Doctor can approve appointments
- ✅ Payments processed on-chain
- ✅ Real-time updates working

**You're ready to develop, test, and deploy!**

Next: Read `TESTING.md` for comprehensive testing procedures.

