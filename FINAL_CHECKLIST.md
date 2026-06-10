# Final Setup Checklist

## Your System is Ready! ✅

Follow these steps in order to get everything running:

---

## Step 1: Environment Variables (2 minutes)
- [ ] Generate BETTER_AUTH_SECRET: `openssl rand -base64 32`
- [ ] Generate NEON_AUTH_COOKIE_SECRET: `openssl rand -base64 32`
- [ ] Get NEXT_PUBLIC_ETHEREUM_RPC_URL from Infura or Alchemy
- [ ] Create `.env.local` file in project root
- [ ] Add all variables to `.env.local`

**Where to get values:**
- NEON DATABASE_URL → Already in Vercel env vars
- Infura RPC → https://infura.io (sign up, create project)
- Alchemy RPC → https://alchemy.com (alternative)

---

## Step 2: Database Migration (1 minute)
- [ ] Open terminal in project directory
- [ ] Run: `pnpm migrate`
- [ ] Wait for success message
- [ ] Check: "Database migration completed successfully!"

**Output should show:**
```
[v0] Starting database migration...
[v0] Found X SQL statements to execute
[v0] Database migration completed successfully!
```

---

## Step 3: Start Dev Server (2 minutes)
- [ ] Run: `pnpm dev`
- [ ] Wait for compilation
- [ ] Open: http://localhost:3000
- [ ] Should see login/register page

---

## Step 4: Test Registration (5 minutes)
- [ ] Click "Register"
- [ ] Select role (Patient or Doctor)
- [ ] Connect MetaMask
- [ ] Fill in details
- [ ] Submit registration
- [ ] ✅ Should see dashboard

**Troubleshooting:**
- If error: check `.env.local` variables
- If database error: run `pnpm migrate` again
- If MetaMask error: ensure wallet is on right network

---

## Step 5: Test New Wallet Change Feature (3 minutes)
- [ ] Click "Change Wallet" button (purple)
- [ ] Click "Connect New Wallet"
- [ ] Select different MetaMask wallet
- [ ] Click "Confirm Change"
- [ ] Sign message in MetaMask
- [ ] See success message
- [ ] ✅ Wallet changed!

**Verify it works:**
- [ ] Logout
- [ ] Login with new wallet
- [ ] Should access same account
- [ ] Old wallet should not work

---

## Step 6: Smart Contract Deployment (10 minutes)
- [ ] Read: `SMART_CONTRACT_DEPLOY.md`
- [ ] Copy contract from `/contracts/DoctorAppointmentPayment.sol`
- [ ] Go to https://remix.ethereum.org/
- [ ] Paste code and compile
- [ ] Deploy to Ethereum (Mainnet or Sepolia)
- [ ] Copy contract address
- [ ] Update `.env.local`: `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...`
- [ ] Restart dev server: `pnpm dev`

---

## Step 7: Test Payments (10 minutes)
- [ ] Register Patient wallet
- [ ] Register Doctor wallet
- [ ] Patient: Book appointment
- [ ] Fill medical form
- [ ] Click "Proceed to Payment"
- [ ] MetaMask popup should appear
- [ ] Confirm transaction
- [ ] Check transaction on Etherscan
- [ ] ✅ Payment successful!

---

## Step 8: Test Real-Time Updates (5 minutes)
- [ ] Open Doctor Dashboard (different browser tab/window)
- [ ] From Patient: Book appointment
- [ ] Doctor Dashboard: Should update within 10 seconds
- [ ] Doctor: Approve/Reject appointment
- [ ] Patient Dashboard: Status should update
- [ ] ✅ Real-time polling works!

---

## Step 9: Test Organ Donation Feature (3 minutes)
- [ ] Login as Patient
- [ ] Click "Organ Donation"
- [ ] Fill form with organ details
- [ ] Consent checkbox
- [ ] Submit
- [ ] ✅ Form submitted!

---

## Step 10: Production Deployment (optional now)
- [ ] Read: `DEPLOYMENT.md`
- [ ] Deploy to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy smart contract to Mainnet
- [ ] Update contract address
- [ ] Launch!

---

## What's Fixed

### ✅ Database Issues
- Migration system created
- All tables automatically initialized
- Indexes for performance
- Ready for queries

### ✅ Registration Errors
- License numbers auto-generated
- Better error messages
- Validation improved

### ✅ New Feature: Change Wallet
- Connect new MetaMask wallet
- Keep same account
- Signature verification
- Works for Patient & Doctor

---

## Quick Reference

### Commands
```bash
# Setup
pnpm migrate              # Create database tables
pnpm dev                  # Start development server

# Build
pnpm build                # Build for production
pnpm start                # Run production server
```

### Key Files
- `.env.local` - Environment variables
- `/migrations/001_init.sql` - Database schema
- `/scripts/run-migration.js` - Migration runner
- `/app/api/auth/change-wallet/route.ts` - Wallet API
- `/app/components/ChangeWalletModal.tsx` - Wallet modal

### Documentation
- `RUN_THIS_FIRST.md` - Quick start
- `FIXES_AND_FEATURES.md` - What's new
- `SMART_CONTRACT_DEPLOY.md` - Deploy contract
- `DEPLOYMENT.md` - Production deployment
- `TESTING.md` - Run full test suite

---

## Troubleshooting

### "Migration Failed"
```bash
# Check Neon connection
pnpm migrate

# If still fails, check:
# 1. DATABASE_URL is correct
# 2. Database exists in Neon
# 3. Network connectivity
```

### "Registration Still Failing"
- Clear browser cache: Ctrl+Shift+Delete
- Restart dev server: Ctrl+C then `pnpm dev`
- Check console for errors: F12 → Console tab

### "MetaMask Not Connecting"
- Refresh page
- Disconnect and reconnect MetaMask
- Check: MetaMask is on Ethereum Mainnet
- Check: Browser console for errors

### "Payment Not Working"
- Deploy smart contract first
- Update NEXT_PUBLIC_CONTRACT_ADDRESS
- Ensure wallet has test ETH
- Check: Network matches contract network

---

## Success Indicators

✅ You'll know it's working when:

1. **Registration page loads** - Database connected
2. **Can register** - Schema created successfully
3. **Dashboard appears** - Authentication working
4. **"Change Wallet" button works** - New feature active
5. **Booking form submits** - API endpoints working
6. **Payment popup appears** - Contract connected
7. **Real-time updates work** - Polling active
8. **Organ donation form submits** - Database inserts working

---

## Next Steps After Setup

1. **Get Mainnet ETH** (if using Mainnet)
   - Buy from Coinbase/Kraken/etc
   - Send to your wallet

2. **Test Everything**
   - Book appointments
   - Make payments
   - Check updates
   - View organ donations

3. **Deploy to Vercel**
   - Follow DEPLOYMENT.md
   - Set environment variables
   - Push to production

4. **Monitor**
   - Check Etherscan for transactions
   - Monitor Neon database
   - Track user activity

---

## Support

Having issues? Check:
1. `RUN_THIS_FIRST.md` - Setup issues
2. `FIXES_AND_FEATURES.md` - What changed
3. `TESTING.md` - Test procedures
4. Project console: `F12` → `Console` tab
5. Dev server logs: Check terminal output

---

## You're All Set! 🚀

Everything is ready. Just:
1. Create `.env.local`
2. Run `pnpm migrate`
3. Run `pnpm dev`
4. Open http://localhost:3000

**Enjoy your blockchain doctor appointment system!**
