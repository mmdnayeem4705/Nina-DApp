# Doctor Appointment Booking System - Blockchain Edition

A cutting-edge blockchain-based doctor appointment booking system that leverages Ethereum smart contracts for transparent, secure, and decentralized payment processing. Built with Next.js 16, Neon PostgreSQL, and MetaMask wallet integration.

## Features

### 🔐 Authentication & Security
- **MetaMask Wallet Integration**: Sign-in and register using your Ethereum wallet
- **Signature-Based Authentication**: Cryptographic message signing for secure authentication
- **No Password Storage**: Pure wallet-based authentication system
- **Session Management**: Secure session tokens with HTTP-only cookies

### 👨‍⚕️ Doctor Features
- **Professional Profile Management**: Add specialization, qualifications, experience, and consultation fees
- **Appointment Dashboard**: Real-time view of pending, approved, and completed appointments
- **Patient Information Access**: View complete patient health records including symptoms, allergies, blood type
- **Appointment Management**: Approve, reject, hold, or mark appointments as completed
- **Real-time Polling**: Automatic updates every 10 seconds for new appointment requests
- **Organ Donor Registry**: Access patient organ donation preferences

### 👤 Patient Features
- **Doctor Discovery**: Browse and filter doctors by medical specialization (16+ specialties)
- **Smart Appointment Booking**: Comprehensive form capturing health details, symptoms, and medical history
- **Blockchain Payments**: Secure payments via Ethereum smart contract with MetaMask
- **Appointment Tracking**: Monitor appointment status from pending through completion
- **Medical Records**: Store blood group, allergies, and medical conditions securely
- **Organ Donation Registry**: Register organ donation preferences with specific doctors

### 💰 Payment System
- **Smart Contract Integration**: Direct payment to doctor wallets via Ethereum
- **Transparent Transactions**: All payments recorded on blockchain with transaction hashes
- **Real-time Payment Status**: Immediate confirmation via MetaMask wallet
- **Doctor Balance Management**: Automatic balance tracking in smart contract
- **No Intermediaries**: Direct peer-to-peer payments between patients and doctors

### ⚡ Real-time Updates
- **Database Polling**: 10-second refresh cycle for appointment status changes
- **Live Status Updates**: Patients see doctor approvals immediately
- **Notification-Ready**: Infrastructure for push notifications (future enhancement)

## Tech Stack

**Frontend:**
- Next.js 16 with App Router
- React 19 with TypeScript
- Tailwind CSS for styling
- Ethers.js for blockchain interaction
- Wagmi for Web3 hooks (installed)

**Backend:**
- Next.js API routes
- Neon PostgreSQL database
- Drizzle ORM for type-safe queries
- Better Auth for authentication

**Blockchain:**
- Solidity smart contract (Ethereum)
- Ethers.js provider integration
- MetaMask wallet provider

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌─────────────────┬──────────────────┬────────────────┐ │
│  │ Patient Pages   │  Doctor Pages    │  Auth Pages    │ │
│  └─────────────────┴──────────────────┴────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Next.js API Routes                     │
│  ┌──────────┬──────────┬─────────┬──────────────────┐  │
│  │  Auth    │ Doctors  │  Appts  │  Organ Donation  │  │
│  └──────────┴──────────┴─────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────┘
            ↓                           ↓
    ┌───────────────────┐      ┌──────────────────┐
    │ Neon PostgreSQL   │      │ Ethereum Network │
    │ (Patient/Doctor   │      │ (Payments &      │
    │  Appointments)    │      │  Smart Contract) │
    └───────────────────┘      └──────────────────┘
```

## Database Schema

### Core Tables
- **users**: User accounts (patients and doctors)
- **doctorProfiles**: Doctor specialization, qualifications, fees
- **patientProfiles**: Patient health records, allergies, blood type
- **appointments**: Booking records with status tracking
- **organDonationForms**: Organ donation registry
- **paymentTransactions**: Blockchain transaction records

## Setup Instructions

### Quick Start (5 minutes)

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   - See `SETUP.md` for detailed instructions
   - Generate secrets and get RPC URL
   - Deploy smart contract and copy address

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open browser:**
   - Visit `http://localhost:3000`
   - Connect MetaMask wallet
   - Register as patient or doctor



## Usage Flows

### Patient Journey
```
1. Register/Login (MetaMask)
   ↓
2. Browse Doctors by Specialty
   ↓
3. Select Doctor
   ↓
4. Fill Appointment Form
   - Date/Time
   - Symptoms
   - Medical History
   - Blood Group
   - Allergies
   ↓
5. MetaMask Payment
   - Review amount
   - Approve transaction
   - Get transaction hash
   ↓
6. Confirmation
   - Appointment ID
   - Transaction hash
   - Next steps
   ↓
7. Track Status (polling every 10s)
   - Pending → Doctor Reviews
   - Approved → Appointment Confirmed
   - Completed → Appointment Done
   ↓
8. (Optional) Register Organ Donation
```

### Doctor Journey
```
1. Register/Login (MetaMask)
   ↓
2. Setup Professional Profile
   - Specialization
   - License
   - Qualifications
   - Consultation Fee
   ↓
3. View Dashboard
   - Total appointments
   - Pending requests
   - Approved appointments
   - Completed appointments
   ↓
4. Review Appointments (polling every 10s)
   - View patient details
   - Review health records
   - Check payment status
   ↓
5. Manage Appointment
   - Approve/Reject
   - Mark as completed
   - View patient organ donation status
```

#

## License

This project is provided as-is for educational and commercial use.



---

**Built with ❤️ using Next.js, Neon, Ethereum, and MetaMask**
