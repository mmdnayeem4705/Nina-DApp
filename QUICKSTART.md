# Quick Start Guide - Doctor Appointment Blockchain System

Get up and running in 15 minutes!

## Prerequisites

- **Node.js** 18+ installed
- **MetaMask** browser extension installed
- **pnpm** package manager (or npm/yarn)

---

## 1. Generate Secrets (2 minutes)

Open your terminal and run these commands:

```bash
# Generate BETTER_AUTH_SECRET
openssl rand -base64 32
# Copy the output

# Generate NEON_AUTH_COOKIE_SECRET  
openssl rand -base64 32
# Copy the output
```

Save both outputs - you'll need them for `.env.local`.

---

## 2. Get Ethereum RPC URL (2 minutes)

### Option A: Use Free Public RPC (Testing)
```
https://rpc.sepolia.dev
```
This works instantly for testing on Sepolia Testnet.

### Option B: Get Infura (5 minutes, Recommended)
1. Go to https://infura.io/ → Sign up
2. Create new API Key → Select "Web3 API"
3. Choose **Sepolia** (for testing) or **Mainnet** (for production)
4. Copy the URL: `https://mainnet.infura.io/v3/YOUR_KEY` or `https://sepolia.infura.io/v3/YOUR_KEY`

---

## 3. Deploy Smart Contract (5 minutes)

Go to https://remix.ethereum.org/

**Step-by-step:**
1. Create new file: `DoctorAppointmentPayment.sol`
2. Paste contract code from `/contracts/DoctorAppointmentPayment.sol`
3. Compile it (Solidity Compiler → 0.8.19)
4. Switch MetaMask to **Sepolia** network
5. Get free test ETH from https://sepoliafaucet.com
6. Deploy it (Deploy & Run Transactions → Deploy button)
7. **Copy the contract address** from "Deployed Contracts" section

---

## 4. Create Environment File (2 minutes)

In the project root, create `.env.local`:

```env
# Use DATABASE_URL from Neon (already connected)
DATABASE_URL=postgresql://[from-neon]

BETTER_AUTH_SECRET=paste_your_openssl_output_here
NEON_AUTH_COOKIE_SECRET=paste_your_openssl_output_here
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://rpc.sepolia.dev
NEXT_PUBLIC_CONTRACT_ADDRESS=0x[paste_your_contract_address]
```

---

## 5. Run the App (2 minutes)

```bash
# Install dependencies (if not done)
pnpm install

# Start development server
pnpm dev
```

**Open http://localhost:3000** in your browser

---

## 6. Test the System

### As a Patient:
1. Click "Register" 
2. Connect MetaMask wallet
3. Select "Patient"
4. Enter name and click "Register"
5. You'll see the patient dashboard
6. Browse doctors by specialty
7. Click a doctor to book appointment
8. Fill the form (symptoms, allergies, blood group)
9. Click "Proceed to Payment"
10. Confirm MetaMask transaction
11. Appointment created!

### As a Doctor:
1. Click "Register"
2. Connect MetaMask (different wallet address)
3. Select "Doctor"
4. Register
5. You'll see the doctor dashboard
6. View incoming appointment requests
7. Click "Approve" to accept
8. View patient details
9. Check organ donation preferences

---

## Troubleshooting

### "Registration failed"
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure MetaMask is unlocked
- Check `.env.local` file exists
- Verify DATABASE_URL is set

### "Can't connect wallet"
- Ensure MetaMask is installed
- Unlock MetaMask
- Refresh page
- Try different browser profile

### "Contract address not found"
- Verify contract was deployed to Sepolia
- Copy exact address (0x + 40 characters)
- No typos in `.env.local`
- Restart dev server after editing `.env.local`

### "Transaction failed in MetaMask"
- Ensure you have test ETH (Sepolia faucet: https://sepoliafaucet.com)
- Gas is set correctly (MetaMask usually auto-sets)
- Check contract address is correct
- Try smaller transaction amount first

---

## What's Next?

### Testing Checklist:
- [ ] Register as patient
- [ ] Register as doctor (different wallet)
- [ ] Patient books appointment
- [ ] Doctor approves appointment
- [ ] Patient makes payment
- [ ] Fill organ donation form
- [ ] Check appointment status updates

### Deployment to Production:
1. See **DEPLOYMENT.md** for Vercel deployment
2. Update RPC URL to Mainnet
3. Deploy contract to Mainnet (costs real ETH)
4. Test thoroughly before going live

---

## File Structure

```
/vercel/share/v0-project/
├── app/
│   ├── api/auth/           # Authentication routes
│   ├── patient/            # Patient pages
│   ├── doctor/             # Doctor pages
│   └── components/         # Shared components
├── contracts/
│   └── DoctorAppointmentPayment.sol
├── db/
│   └── schema.ts           # Database schema
├── lib/
│   ├── db.ts              # Database connection
│   └── ethereum.ts        # Web3 utilities
└── .env.local             # Your environment variables
```

---

## Available Routes

### Public
- `/` → Login/Register page

### Patient Routes
- `/patient/dashboard` → Browse doctors
- `/patient/book-appointment/[doctorId]` → Book appointment
- `/patient/my-appointments` → View bookings
- `/patient/organ-donation` → Register organ donation
- `/patient/appointment-confirmed/[id]` → Confirmation

### Doctor Routes
- `/doctor/dashboard` → View appointments
- `/doctor/profile` → Update profile & specialization
- `/doctor/appointment/[id]` → View patient details

---

## Smart Contract Functions

### For Patients:
- **Create Appointment** → Records appointment on-chain
- **Pay for Appointment** → Sends ETH to doctor's wallet

### For Doctors:
- **Get Balance** → View available ETH from payments
- **Withdraw Balance** → Transfer ETH to wallet

---

## Network Information

### Sepolia Testnet (Recommended for Testing)
- Chain ID: 11155111
- RPC: https://rpc.sepolia.dev
- Block Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com (free test ETH)

### Ethereum Mainnet (Production)
- Chain ID: 1
- RPC: https://mainnet.infura.io/v3/YOUR_KEY
- Block Explorer: https://etherscan.io
- Requires real ETH ($$)

---

## Commands Reference

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# View logs
pnpm logs
```

---

## Support & Documentation

- **Full Setup Guide**: See `ENV_SETUP.md`
- **Smart Contract Deploy**: See `SMART_CONTRACT_DEPLOY.md`
- **Architecture & Features**: See `PROJECT_SUMMARY.md`
- **Production Deployment**: See `DEPLOYMENT.md`

---

## Security Notes

⚠️ **Important:**
1. Never commit `.env.local` (it's in .gitignore)
2. Never share your `BETTER_AUTH_SECRET`
3. Use Sepolia Testnet first (free, safe)
4. Test thoroughly before Mainnet deployment
5. Always verify contract addresses before transactions

Happy building! 🚀

