# Doctor Appointment Booking System - Setup Guide

A blockchain-based doctor appointment booking system with MetaMask wallet integration and Ethereum payments.

## Prerequisites

- Node.js 18+ installed
- MetaMask browser extension installed
- Ethereum wallet with test ETH (if using testnet)
- Neon PostgreSQL database connection

## Environment Variables Setup

### 1. Generate Required Secrets

Generate two secure random strings:

```bash
openssl rand -base64 32
# Copy output - use for BETTER_AUTH_SECRET
openssl rand -base64 32
# Copy output - use for NEON_AUTH_COOKIE_SECRET
```

### 2. Get Ethereum RPC URL

Choose one:
- **Infura** (https://infura.io/): Free tier available, create project for Ethereum Mainnet
- **Alchemy** (https://www.alchemy.com/): Free tier available
- **Public RPC**: `https://rpc.ankr.com/eth` (for testing)

Format: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`

### 3. Smart Contract Deployment

The `DoctorAppointmentPayment.sol` contract needs to be deployed:

**Option A: Using Remix IDE (Easiest)**
1. Go to https://remix.ethereum.org/
2. Create new file: `DoctorAppointmentPayment.sol`
3. Copy contract code from `/contracts/DoctorAppointmentPayment.sol`
4. Compile (Solidity 0.8.0)
5. Deploy to Ethereum Mainnet via MetaMask
6. Copy deployed contract address

**Option B: Using Hardhat (Advanced)**
```bash
npm install -g hardhat
hardhat init
# Follow prompts, then deploy contract
```

### 4. Environment File

Create `.env.local` in project root:

```env
# Database (from Neon integration)
DATABASE_URL=postgresql://user:password@host/dbname

# Authentication
BETTER_AUTH_SECRET=<your-generated-secret-1>
NEON_AUTH_COOKIE_SECRET=<your-generated-secret-2>

# Ethereum
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
NEXT_PUBLIC_CONTRACT_ADDRESS=0x<deployed-contract-address>
```

## Installation & Running

```bash
# Install dependencies
pnpm install

# Set up database schema (Neon handles this automatically with Drizzle)
# The schema is defined in db/schema.ts

# Run development server
pnpm dev

# Open http://localhost:3000
```

## System Architecture

### Database Schema (Neon PostgreSQL)

- **users**: All users (patients and doctors)
- **doctorProfiles**: Doctor-specific information (specialization, license, fees)
- **patientProfiles**: Patient-specific information (blood group, allergies, etc.)
- **appointments**: Appointment bookings with status tracking
- **organDonationForms**: Organ donation registration
- **paymentTransactions**: Blockchain payment records

### Smart Contract

`DoctorAppointmentPayment.sol` handles:
- Payment reception for appointments
- Balance tracking per doctor
- Payment release to doctors
- Emergency withdrawal by owner

### Frontend Routes

**Patient Routes:**
- `/`: Login/Register page
- `/patient/dashboard`: Browse doctors by specialty
- `/patient/book-appointment/[doctorId]`: Booking form
- `/patient/appointment-confirmed/[appointmentId]`: Confirmation
- `/patient/my-appointments`: View all appointments
- `/patient/organ-donation`: Register organ donation

**Doctor Routes:**
- `/doctor/dashboard`: View pending appointments
- `/doctor/appointment/[appointmentId]`: Appointment details
- `/doctor/profile`: Update professional information

## How It Works

### Patient Flow

1. **Register/Login**: Connect MetaMask wallet, sign message to authenticate
2. **Browse Doctors**: Filter by specialization (Cardiology, Neurology, etc.)
3. **Book Appointment**: 
   - Select doctor
   - Fill appointment form (symptoms, allergies, blood group, description)
   - Submit form
4. **Payment**: 
   - Payment modal appears with doctor address and fee
   - Click "Pay with MetaMask"
   - Approve transaction in MetaMask
   - Transaction hash stored in database
5. **Confirmation**: Receive confirmation with appointment ID and transaction hash
6. **Track Status**: Monitor appointment status in "My Appointments"
7. **Organ Donation**: Optionally register organ donation preferences

### Doctor Flow

1. **Register/Login**: Connect MetaMask wallet
2. **Setup Profile**: Add specialization, license, qualifications, consultation fee
3. **Dashboard**: View all pending appointments (real-time polling every 10 seconds)
4. **Manage Appointments**:
   - View patient details (symptoms, medical history, etc.)
   - Approve or reject appointments
   - Mark as completed
5. **Real-time Updates**: Automatically refreshes appointment list

## Key Features

✅ **MetaMask Integration**: Wallet-based authentication and payments  
✅ **Blockchain Payments**: Ethereum smart contract for transparent transactions  
✅ **Real-time Updates**: Database polling for appointment status changes  
✅ **Doctor Specializations**: 16 medical specialties  
✅ **Organ Donation**: Register donation preferences with doctor  
✅ **Patient Health Records**: Blood group, allergies, medical conditions  
✅ **Appointment Management**: Approve, reject, complete, or cancel  
✅ **Transaction Tracking**: All payments recorded on blockchain  

## Security Features

- MetaMask signature verification for authentication
- No password storage (wallet-based auth)
- Parameterized database queries (SQL injection prevention)
- Environment variables for sensitive data
- Session-based authentication with secure cookies
- Payment transaction hashes stored for transparency

## Testing

### Test MetaMask Transactions

1. Get test ETH from Ethereum testnet faucet
2. Switch MetaMask to Sepolia Testnet
3. Update `NEXT_PUBLIC_ETHEREUM_RPC_URL` to testnet RPC
4. Deploy contract to testnet
5. Update contract address in `.env.local`
6. Test appointment booking with test ETH

### Test Accounts

Create test users:
- **Patient 1**: Register as patient with MetaMask
- **Doctor 1**: Register as doctor, set specialization and fee
- **Doctor 2**: Register as doctor with different specialty

## Troubleshooting

### MetaMask Not Connecting
- Ensure MetaMask is installed and unlocked
- Check browser console for errors
- Verify network is set to Ethereum Mainnet

### Payments Not Processing
- Verify contract address is correct in `.env.local`
- Check wallet has sufficient ETH balance
- Ensure RPC URL is accessible
- Verify contract is deployed to correct network

### Database Connection Issues
- Check DATABASE_URL is valid
- Ensure Neon database is running
- Verify network connectivity

### Smart Contract Errors
- Verify Solidity version (0.8.0+)
- Check contract bytecode deployed matches source
- Ensure payment value is > 0

## Deployment to Production

1. **Update Environment**:
   - Use Ethereum Mainnet RPC
   - Set secure session secrets
   - Use production database URL

2. **Smart Contract**:
   - Deploy to Ethereum Mainnet
   - Verify contract on Etherscan
   - Document contract address

3. **Database**:
   - Use production Neon database
   - Enable backups
   - Monitor performance

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

5. **Security Checklist**:
   - ✅ All env vars configured
   - ✅ Contract verified on Etherscan
   - ✅ Database backups enabled
   - ✅ HTTPS enabled
   - ✅ Rate limiting implemented
   - ✅ Error logging setup

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with wallet signature
- `GET /api/doctors` - List doctors (filter by specialization)
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/[id]` - Update appointment
- `GET /api/organ-donation` - Get organ donation forms
- `POST /api/organ-donation` - Create donation form

## Support & Documentation

- **Smart Contract Docs**: See `contracts/DoctorAppointmentPayment.sol` comments
- **Database Schema**: See `db/schema.ts`
- **API Routes**: See `app/api/` directory
- **Components**: See `app/components/` and pages

## License

This project is provided as-is for educational and commercial use.
