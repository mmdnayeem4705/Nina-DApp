# Environment Variables Setup Guide

This guide walks you through setting up all necessary environment variables for the Doctor Appointment Booking System.

## Step 1: Generate Secrets

Generate cryptographic secrets using OpenSSL. Run these commands in your terminal:

### Generate BETTER_AUTH_SECRET
```bash
openssl rand -base64 32
```
**Output example:**
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abc=
```
Copy this value and save it.

### Generate NEON_AUTH_COOKIE_SECRET
```bash
openssl rand -base64 32
```
Copy this value as well.

---

## Step 2: Get Ethereum RPC URL

Choose one of the following options:

### Option A: Infura (Recommended for Production)

1. Go to https://infura.io/
2. Sign up for a free account
3. Create a new project:
   - Click "Create New Key"
   - Select "Web3 API" 
   - Name it "Doctor Appointment"
4. Select **Ethereum Mainnet** (if using production) or **Sepolia** (if testing)
5. Copy the URL under "Endpoints" that looks like:
   ```
   https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   ```

### Option B: Alchemy (Recommended Alternative)

1. Go to https://www.alchemy.com/
2. Sign up for free
3. Create a new app:
   - Network: **Ethereum**
   - Chain: **Mainnet** (or Sepolia for testing)
   - Name: "Doctor Appointment"
4. Go to the app and click "API Key"
5. Copy the HTTPS URL (looks like `https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY`)

### Option C: Free Public RPC (Testing Only)

For testing purposes, use:
```
https://rpc.ankr.com/eth
```

**Important Note:** If you're using Ethereum Mainnet, you'll be sending real ETH payments. For testing/development, use **Sepolia Testnet** with free test ETH from faucets.

---

## Step 3: Deploy Smart Contract

The system includes a smart contract (`DoctorAppointmentPayment.sol`) that handles payments.

### Deploy Using Remix IDE (Easiest)

1. Go to https://remix.ethereum.org/
2. Create a new file: `DoctorAppointmentPayment.sol`
3. Copy the contract code from `/vercel/share/v0-project/contracts/DoctorAppointmentPayment.sol`
4. Compile:
   - Select "Solidity Compiler" (version 0.8.19+)
   - Click "Compile DoctorAppointmentPayment.sol"
5. Deploy:
   - Click "Deploy & Run Transactions"
   - Select your wallet (MetaMask) as the environment
   - Click "Deploy"
6. **Copy the contract address** (shown after deployment)
   - It will look like: `0x1234567890abcdef1234567890abcdef12345678`

### Deploy Using Hardhat (Advanced)

```bash
# Install Hardhat
npm install --save-dev hardhat

# Initialize project
npx hardhat

# Copy contract to contracts/ directory
# Update hardhat.config.js with your RPC URL and private key

# Deploy
npx hardhat run scripts/deploy.js --network ethereum
```

---

## Step 4: Create .env.local File

In the root directory of your project, create a `.env.local` file with the following content:

```env
# Database Connection (Neon)
DATABASE_URL=postgresql://user:password@host/database

# Authentication Secrets
BETTER_AUTH_SECRET=<PASTE_YOUR_GENERATED_SECRET_HERE>
NEON_AUTH_COOKIE_SECRET=<PASTE_YOUR_GENERATED_SECRET_HERE>

# Ethereum Configuration
NEXT_PUBLIC_ETHEREUM_RPC_URL=<PASTE_YOUR_RPC_URL_HERE>
NEXT_PUBLIC_CONTRACT_ADDRESS=<PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS>

# Optional: For Infura
# NEXT_PUBLIC_INFURA_API_KEY=<YOUR_INFURA_KEY>
```

### Example .env.local (DO NOT COPY VALUES):
```env
DATABASE_URL=postgresql://user123:pass456@ep-cool-wave-12345.us-east-1.postgres.vercel-storage.com/dbname
BETTER_AUTH_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abc=
NEON_AUTH_COOKIE_SECRET=xYzAbCdEfGhIjKlMnOpQrStUvWxYz123456789=
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

---

## Step 5: Verify Environment Variables

Run this command to verify your setup:

```bash
npm run verify-env
```

Or manually check:
```bash
echo $BETTER_AUTH_SECRET
echo $NEXT_PUBLIC_CONTRACT_ADDRESS
```

---

## Step 6: Database Initialization

Your Neon database was automatically set up when you connected the integration. The schema includes:

- **users**: Core user accounts
- **doctor_profiles**: Doctor-specific information
- **patient_profiles**: Patient-specific information  
- **appointments**: Appointment bookings
- **payments**: Transaction records
- **organ_donations**: Organ donation forms

All tables are ready to use!

---

## Troubleshooting

### "Missing DATABASE_URL"
- Check that Neon integration is connected in v0 Settings
- Verify DATABASE_URL is set in environment variables

### "Invalid Contract Address"
- Ensure the address is 42 characters long (0x + 40 hex characters)
- Make sure you deployed the contract to the correct network
- Use the address shown after successful deployment

### "RPC Connection Failed"
- Test your RPC URL: `curl YOUR_RPC_URL`
- Ensure the network matches your contract deployment
- For Sepolia testnet, use: `https://rpc.sepolia.dev`

### Registration Still Failing
- Clear browser cache and cookies
- Check browser console for detailed error messages
- Ensure MetaMask is installed and unlocked
- Try a different wallet address if you've previously registered

---

## Next Steps

1. ✅ Generate secrets
2. ✅ Get Ethereum RPC URL
3. ✅ Deploy smart contract
4. ✅ Create .env.local
5. **Run the app**: `pnpm dev`
6. **Test locally**: http://localhost:3000
7. **Deploy to Vercel**: See DEPLOYMENT.md

---

## Network Information

### Ethereum Mainnet
- **Network ID**: 1
- **Chain ID**: 1
- **RPC**: https://mainnet.infura.io/v3/YOUR_KEY
- **Block Explorer**: https://etherscan.io
- **Status**: Uses real ETH (requires funds)

### Sepolia Testnet (Recommended for Testing)
- **Network ID**: 11155111
- **Chain ID**: 11155111
- **RPC**: https://rpc.sepolia.dev
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com (free test ETH)
- **Status**: Test network (free to use)

### Switching Networks

In your browser's MetaMask:
1. Click the network dropdown at the top
2. Select "Add a custom network"
3. Enter the network details from above
4. Save and switch to it

---

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit `.env.local` to version control** - It's in `.gitignore` by default
2. **Never share your BETTER_AUTH_SECRET** - It's used for session encryption
3. **Test on Sepolia Testnet first** - Before deploying to Mainnet with real ETH
4. **Use hardware wallets for production** - MetaMask browser extension is good for testing
5. **Monitor contract interactions** - Use Etherscan to verify all transactions

For production deployments, use secrets management services like Vercel's environment variables system.

