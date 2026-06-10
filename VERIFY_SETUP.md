# Setup Verification Checklist

Use this document to verify that everything is properly configured before running the app.

---

## Checklist 1: File Structure

Run this to verify all files exist:

```bash
cd /vercel/share/v0-project

# Check critical files
ls -la .env.local              # Should exist
ls -la package.json            # Should exist
ls -la app/page.tsx            # Should exist
ls -la db/schema.ts            # Should exist
ls -la lib/db.ts               # Should exist
ls -la lib/ethereum.ts         # Should exist
ls -la contracts/DoctorAppointmentPayment.sol  # Should exist
```

**Expected Results:**
- ✅ All files listed above exist
- ✅ .env.local is in root directory
- ✅ Files are readable (no permission errors)

---

## Checklist 2: Environment Variables

Run this command:

```bash
# Check environment file
cat .env.local
```

**You should see all 5 variables:**

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
NEON_AUTH_COOKIE_SECRET=...
NEXT_PUBLIC_ETHEREUM_RPC_URL=...
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

**Verify each:**

- ✅ DATABASE_URL: Starts with `postgresql://`
- ✅ BETTER_AUTH_SECRET: 44+ characters, no quotes
- ✅ NEON_AUTH_COOKIE_SECRET: 44+ characters, no quotes
- ✅ NEXT_PUBLIC_ETHEREUM_RPC_URL: Valid URL (https://...)
- ✅ NEXT_PUBLIC_CONTRACT_ADDRESS: Starts with `0x`, 42 characters total

---

## Checklist 3: Dependencies

Run this to check dependencies:

```bash
pnpm list ethers web3 drizzle-orm postgres
```

**You should see:**
```
├── ethers@...
├── web3@...
├── drizzle-orm@...
└── postgres@...
```

**If missing, install:**
```bash
pnpm add ethers web3 wagmi @wagmi/core drizzle-orm postgres
```

---

## Checklist 4: Database Connection

Test database connection:

```bash
node -e "require('dotenv').config(); const { Pool } = require('postgres'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT 1').then(() => { console.log('✅ Database connected'); process.exit(0); }).catch(err => { console.error('❌ Database error:', err.message); process.exit(1); });"
```

**Expected Output:**
```
✅ Database connected
```

**If error:**
- Check DATABASE_URL is correct
- Verify Neon integration is connected
- Check network connectivity

---

## Checklist 5: MetaMask Configuration

Open browser console (F12) and run:

```javascript
// Check MetaMask is installed
if (window.ethereum) {
  console.log("✅ MetaMask is installed");
  console.log("Network ID:", await window.ethereum.request({ method: 'eth_chainId' }));
  console.log("Accounts:", await window.ethereum.request({ method: 'eth_accounts' }));
} else {
  console.log("❌ MetaMask is not installed");
}
```

**Expected Output:**
- ✅ MetaMask is installed
- ✅ Network ID shown
- ✅ At least one account connected

---

## Checklist 6: Blockchain Network

Verify you're on correct network:

1. Click MetaMask icon
2. Check network dropdown (top of extension)
3. Should show: **Sepolia test network** (for testing)
4. Or: **Ethereum Mainnet** (for production)

**If wrong network:**
1. Click network dropdown
2. Select "Sepolia test network" for testing
3. Or add custom network (see ENV_SETUP.md)

---

## Checklist 7: Smart Contract Deployment

Verify contract is deployed:

```bash
# Check contract address format
echo $NEXT_PUBLIC_CONTRACT_ADDRESS

# Should output something like:
# 0x1234567890abcdef1234567890abcdef12345678
```

**Verify on Etherscan:**

1. Go to https://sepolia.etherscan.io/ (or https://etherscan.io/ for mainnet)
2. Search for your contract address
3. You should see:
   - ✅ Contract code
   - ✅ Transactions
   - ✅ Recent activity

---

## Checklist 8: Dev Server Status

Test development server:

```bash
# Check if server is running
lsof -i :3000

# Should show node process listening on port 3000
```

**If not running:**
```bash
# Start the server
pnpm dev

# Wait for output:
# > Ready in 2.3s
# > Local: http://localhost:3000
```

---

## Checklist 9: Browser Testing

Open http://localhost:3000 and verify:

- ✅ Page loads (no blank page)
- ✅ Title shows "Doctor Appointment System"
- ✅ "Register" button visible
- ✅ No console errors (F12 → Console tab)
- ✅ Network requests succeed (F12 → Network tab)

**If page doesn't load:**
1. Check dev server is running
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Try different browser

---

## Checklist 10: Wallet Connection Test

1. Click "Register" button
2. Click "Connect MetaMask Wallet"
3. MetaMask popup appears
4. Select account and click "Next"
5. Click "Connect"

**Expected:**
- ✅ MetaMask popup opens
- ✅ Account selection works
- ✅ Returns to app with wallet connected
- ✅ Shows wallet address (formatted: 0x123...abc)

---

## Checklist 11: Registration Test

After wallet connection:

1. For registration:
   - [ ] Select "Patient" or "Doctor"
   - [ ] Enter full name
   - [ ] Click "Register"
   - [ ] Sign message in MetaMask
   - [ ] Wait for confirmation

**Expected:**
- ✅ Message to sign appears in MetaMask
- ✅ Can sign without errors
- ✅ Redirected to dashboard
- ✅ User info displays correctly

**If registration fails:**
- Check console for error (F12)
- Verify smart contract address
- Ensure database is connected
- Try different wallet account

---

## Checklist 12: Dashboard Test

After successful registration:

**Patient Dashboard:**
- ✅ Page loads
- ✅ Doctor list visible
- ✅ Search/filter works
- ✅ Doctor cards show (name, specialty, fee)
- ✅ Can click doctor to book

**Doctor Dashboard:**
- ✅ Page loads
- ✅ Shows "Appointments" section
- ✅ Profile setup available
- ✅ Specialization editable

---

## Checklist 13: Quick Performance Test

In browser DevTools (F12 → Performance tab):

1. Record page load
2. Open page
3. Stop recording

**Expected timings:**
- Page load: < 3 seconds
- Dashboard load: < 3 seconds
- API responses: < 1 second

---

## Troubleshooting Quick Guide

### Problem: ".env.local not found"
```bash
# Check file exists
ls -la /vercel/share/v0-project/.env.local

# If missing, create it
touch /vercel/share/v0-project/.env.local
# Then add all variables
```

### Problem: "Cannot find module"
```bash
# Reinstall dependencies
pnpm install

# Restart dev server
pnpm dev
```

### Problem: "Database connection failed"
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Problem: "Contract not found"
1. Verify contract address in .env.local
2. Check contract is deployed to correct network
3. Verify on Etherscan
4. Re-deploy if needed

### Problem: "MetaMask connection failed"
1. Clear browser cache
2. Unlock MetaMask
3. Check network is correct
4. Try different browser profile

---

## Test Scenarios

### Scenario 1: Complete Patient Flow

```
✅ Register patient
   ├─ Step 1: Connect wallet
   ├─ Step 2: Select patient role
   ├─ Step 3: Enter name
   └─ Step 4: Sign and register

✅ Browse doctors
   ├─ Step 1: See doctor list
   ├─ Step 2: View doctor details
   └─ Step 3: Click to book

✅ Book appointment
   ├─ Step 1: Fill form
   ├─ Step 2: Validate form
   └─ Step 3: Submit

✅ Make payment
   ├─ Step 1: See payment modal
   ├─ Step 2: Verify amount
   ├─ Step 3: Confirm in MetaMask
   └─ Step 4: Transaction succeeds

✅ Check status
   ├─ Step 1: View appointment
   ├─ Step 2: See pending status
   └─ Step 3: Wait for doctor approval
```

### Scenario 2: Complete Doctor Flow

```
✅ Register doctor
   ├─ Step 1: Connect wallet
   ├─ Step 2: Select doctor role
   ├─ Step 3: Enter name
   └─ Step 4: Sign and register

✅ View appointments
   ├─ Step 1: See dashboard
   ├─ Step 2: See appointment requests
   └─ Step 3: Click to view details

✅ Review patient info
   ├─ Step 1: See patient details
   ├─ Step 2: Check symptoms/allergies
   └─ Step 3: View payment info

✅ Approve appointment
   ├─ Step 1: Click approve
   ├─ Step 2: Confirm action
   └─ Step 3: Status updates

✅ Update profile
   ├─ Step 1: Go to profile page
   ├─ Step 2: Update specialization
   ├─ Step 3: Set consultation fee
   └─ Step 4: Save changes
```

---

## Final Verification Command

Run all checks at once:

```bash
#!/bin/bash

echo "🔍 Verifying Doctor Appointment System Setup..."
echo ""

echo "1. Checking files..."
test -f .env.local && echo "   ✅ .env.local exists" || echo "   ❌ .env.local missing"
test -f package.json && echo "   ✅ package.json exists" || echo "   ❌ package.json missing"
test -f db/schema.ts && echo "   ✅ db/schema.ts exists" || echo "   ❌ db/schema.ts missing"

echo ""
echo "2. Checking environment variables..."
test -n "$DATABASE_URL" && echo "   ✅ DATABASE_URL set" || echo "   ❌ DATABASE_URL missing"
test -n "$BETTER_AUTH_SECRET" && echo "   ✅ BETTER_AUTH_SECRET set" || echo "   ❌ BETTER_AUTH_SECRET missing"
test -n "$NEXT_PUBLIC_CONTRACT_ADDRESS" && echo "   ✅ NEXT_PUBLIC_CONTRACT_ADDRESS set" || echo "   ❌ NEXT_PUBLIC_CONTRACT_ADDRESS missing"

echo ""
echo "3. Checking dependencies..."
pnpm list ethers > /dev/null 2>&1 && echo "   ✅ ethers installed" || echo "   ❌ ethers missing"
pnpm list drizzle-orm > /dev/null 2>&1 && echo "   ✅ drizzle-orm installed" || echo "   ❌ drizzle-orm missing"

echo ""
echo "✅ Basic verification complete!"
echo "Run 'pnpm dev' to start the development server"
```

---

## Success Criteria

You're ready to go when:

- ✅ All environment variables set in .env.local
- ✅ All files exist in correct locations
- ✅ Dependencies installed (pnpm install)
- ✅ Dev server starts without errors
- ✅ http://localhost:3000 loads
- ✅ MetaMask connects successfully
- ✅ Registration succeeds
- ✅ Dashboard appears
- ✅ No console errors

---

## Next Steps

Once verification passes:

1. ✅ Run `pnpm dev`
2. ✅ Open http://localhost:3000
3. ✅ Follow TESTING.md for comprehensive tests
4. ✅ Read PROJECT_SUMMARY.md for architecture
5. ✅ See DEPLOYMENT.md for production

---

## Support

If verification fails:

1. Check relevant guide:
   - Environment: ENV_SETUP.md
   - Contract: SMART_CONTRACT_DEPLOY.md
   - Database: COMPLETE_SETUP.md

2. Check browser console: F12 → Console tab

3. Check error logs:
   - Terminal output
   - MetaMask notifications
   - Network tab (F12)

4. Restart everything:
   - Stop dev server (Ctrl+C)
   - Clear cache (Ctrl+Shift+Delete)
   - Run `pnpm dev` again

**You've got this! 🚀**

