# Run This First - Complete Setup Guide

## Step 1: Create `.env.local` File

Create a file named `.env.local` in the project root with these environment variables:

```env
# Database URL (from Neon)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# Authentication Secrets (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=YOUR_SECRET_HERE
NEON_AUTH_COOKIE_SECRET=YOUR_SECRET_HERE

# Ethereum RPC URL (from Infura or Alchemy)
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Smart Contract Address (deploy first, then add here)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

### How to Get Each Value:

**1. DATABASE_URL (Neon)**
- Already connected via integration
- Should be available in your Vercel project environment variables

**2. BETTER_AUTH_SECRET & NEON_AUTH_COOKIE_SECRET**
Generate secrets in terminal:
```bash
openssl rand -base64 32
```
Copy the output to both fields.

**3. NEXT_PUBLIC_ETHEREUM_RPC_URL**
- Go to https://infura.io/
- Sign up and create project
- Copy Mainnet URL OR use Sepolia for testing

**4. NEXT_PUBLIC_CONTRACT_ADDRESS**
- Deploy smart contract first (see step below)
- Then copy the contract address here

---

## Step 2: Run Database Migration

This creates all necessary tables in your Neon database.

```bash
pnpm migrate
```

You should see:
```
[v0] Starting database migration...
[v0] Found X SQL statements to execute
[v0] Executed statement 1/X
...
[v0] Database migration completed successfully!
```

---

## Step 3: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

---

## Step 4: Test Authentication (No MetaMask Needed Yet)

1. Install MetaMask if not already installed
2. Create a test account
3. Click "Register"
4. Select role (Patient or Doctor)
5. Connect MetaMask
6. Complete registration

**You should now see your dashboard!**

---

## Step 5: Deploy Smart Contract (For Payments)

See `SMART_CONTRACT_DEPLOY.md` for detailed instructions using:
- Remix IDE (easiest)
- Hardhat (advanced)

After deployment, update `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x[your-contract-address]
```

---

## Step 6: Test Full Flow

1. Register 2 accounts (Patient & Doctor)
2. Patient: Book appointment
3. Patient: Proceed to payment
4. MetaMask popup should appear
5. Confirm payment
6. Check Doctor dashboard

---

## Troubleshooting

### "Failed query" Error
- Run `pnpm migrate` first
- Check DATABASE_URL is correct

### MetaMask Not Connecting
- Ensure MetaMask is installed
- Try refreshing page
- Check console for error details

### Payment Fails
- Deploy smart contract first
- Update NEXT_PUBLIC_CONTRACT_ADDRESS
- Ensure sufficient ETH in wallet

### Database Connection Error
- Check Neon DATABASE_URL is correct
- Verify network connectivity
- Check database exists and is accessible

---

## Next: Read Documentation

After setup works:
1. Read `SMARTCONTRACT_DEPLOY.md` to deploy contract
2. Read `TESTING.md` to run tests
3. Read `DEPLOYMENT.md` to deploy to production

Enjoy your blockchain doctor appointment system!
