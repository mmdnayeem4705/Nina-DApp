# Architecture Diagrams - Doctor Appointment Blockchain System

Visual representations of system architecture and flows.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                          FRONTEND LAYER                                  │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │
│  │   Auth Form     │  │  Patient        │  │  Doctor Dashboard    │   │
│  │                 │  │  Dashboard      │  │                      │   │
│  │ • Connect       │  │ • Browse        │  │ • View Requests      │   │
│  │ • Register      │  │ • Book Form     │  │ • Approve/Reject     │   │
│  │ • Sign Message  │  │ • Payment Flow  │  │ • View Patient Info  │   │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬───────────┘   │
│           │                    │                      │                 │
│           └────────────────────┼──────────────────────┘                 │
│                                │                                        │
│                    ┌───────────┴────────────┐                          │
│                    │  Authentication       │                          │
│                    │  Context              │                          │
│                    │  (React Context)      │                          │
│                    └───────────┬────────────┘                          │
│                                │                                        │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
┌───────────────▼───────────────┐  ┌─────────────▼──────────────────┐
│      API ROUTES LAYER         │  │   ETHEREUM RPC LAYER           │
│                               │  │                                 │
│  ┌─────────────────────────┐  │  │  ┌────────────────────────┐   │
│  │  /api/auth              │  │  │  │  Web3 Provider         │   │
│  │  • register             │  │  │  │  • Sepolia RPC         │   │
│  │  • login                │  │  │  │  • Mainnet RPC         │   │
│  │  • verify signature     │  │  │  │  • Contract ABI        │   │
│  └─────────────────────────┘  │  │  └────────────────────────┘   │
│                               │  │                                 │
│  ┌─────────────────────────┐  │  │  ┌────────────────────────┐   │
│  │  /api/appointments      │  │  │  │  Transaction Handling  │   │
│  │  • create               │  │  │  │  • Send Payment        │   │
│  │  • list                 │  │  │  │  • Verify Hash         │   │
│  │  • update status        │  │  │  │  • Track Status        │   │
│  └─────────────────────────┘  │  │  └────────────────────────┘   │
│                               │  │                                 │
│  ┌─────────────────────────┐  │  │  ┌────────────────────────┐   │
│  │  /api/doctors           │  │  │  │  Smart Contract        │   │
│  │  • list doctors         │  │  │  │  • Payment Processing  │   │
│  │  • get specialties      │  │  │  │  • Balance Tracking    │   │
│  │  • update profile       │  │  │  │  • Appointment Records │   │
│  └─────────────────────────┘  │  │  └────────────────────────┘   │
│                               │  │                                 │
│  ┌─────────────────────────┐  │  │                                 │
│  │  /api/organ-donation    │  │  │                                 │
│  │  • register donor       │  │  │                                 │
│  │  • get donors           │  │  │                                 │
│  └─────────────────────────┘  │  │                                 │
│                               │  │                                 │
└───────────────┬───────────────┘  └─────────────┬──────────────────┘
                │                                │
                │        ┌──────────────────────┘
                │        │
                ▼        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                    │
│                   Neon PostgreSQL                                       │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Users Table  │  │ Doctor Prof  │  │ Appointments │  │ Payments   │ │
│  │              │  │              │  │              │  │            │ │
│  │ • ID         │  │ • ID         │  │ • ID         │  │ • ID       │ │
│  │ • Wallet     │  │ • License    │  │ • Patient    │  │ • Appt ID  │ │
│  │ • Role       │  │ • Specialty  │  │ • Doctor     │  │ • Amount   │ │
│  │ • Full Name  │  │ • Fee        │  │ • Status     │  │ • Tx Hash  │ │
│  └──────────────┘  │ • Verified   │  │ • Date       │  │ • Verified │ │
│                    └──────────────┘  └──────────────┘  └────────────┘ │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │ Patient Prof │  │ Specialties  │  │ Org Donation │                 │
│  │              │  │              │  │              │                 │
│  │ • User ID    │  │ • ID         │  │ • ID         │                 │
│  │ • Created At │  │ • Name       │  │ • Patient    │                 │
│  └──────────────┘  │ • Type       │  │ • Doctor     │                 │
│                    └──────────────┘  │ • Organs     │                 │
│                                       │ • Contact    │                 │
│                                       └──────────────┘                 │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    BLOCKCHAIN LAYER                                     │
│                   Ethereum (Smart Contract)                             │
│                                                                          │
│  DoctorAppointmentPayment Smart Contract                               │
│  ├─ Receives ETH payments from patients                                │
│  ├─ Stores payments in doctor balance mapping                         │
│  ├─ Records appointment on-chain                                       │
│  ├─ Allows doctor withdrawal                                           │
│  └─ All transactions verified on Etherscan                            │
│                                                                          │
│  Network: Sepolia Testnet (dev) / Ethereum Mainnet (prod)             │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Patient Appointment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PATIENT BOOKING FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

1. REGISTRATION
   ┌──────────────────┐
   │ Click Register   │
   └────────┬─────────┘
            │
   ┌────────▼──────────────────┐
   │ Connect MetaMask Wallet    │
   │ (MetaMask Popup Opens)     │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Select Patient Role        │
   │ Enter Full Name            │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Sign Message               │
   │ (MetaMask Signature)       │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ POST /api/auth/register    │
   │ Verify Signature           │
   │ Create User Record         │
   │ Create Patient Profile     │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ ✅ Patient Dashboard       │
   │ (Doctor List Visible)      │
   └────────────────────────────┘

2. BROWSE DOCTORS
   ┌──────────────────┐
   │ View Doctor List │
   │ GET /api/doctors │
   └────────┬─────────┘
            │
   ┌────────▼──────────────────┐
   │ Filter by Specialty        │
   │ (16+ Specializations)      │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Select Doctor              │
   │ Click "Book Appointment"   │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Navigate to Booking Form   │
   └────────────────────────────┘

3. FILL APPOINTMENT FORM
   ┌────────────────────┐
   │ Fill Form:         │
   │ • Name             │
   │ • Age              │
   │ • Gender           │
   │ • Blood Group      │
   │ • Symptoms         │
   │ • Allergies        │
   │ • Medical History  │
   └────────┬───────────┘
            │
   ┌────────▼──────────────────┐
   │ Validate All Fields        │
   │ Show Consultation Fee      │
   │ Display Total Amount       │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Click "Proceed to Payment" │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Payment Modal Opens        │
   │ Shows:                     │
   │ • Doctor Wallet Address    │
   │ • Amount in ETH            │
   │ • "Confirm with MetaMask"  │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Click "Confirm Payment"    │
   └────────┬──────────────────┘

4. METAMASK PAYMENT
   ┌──────────────────────────┐
   │ MetaMask Popup Opens      │
   │ Shows:                    │
   │ • To: Doctor Wallet       │
   │ • Amount: X ETH           │
   │ • Gas Fee (Auto)          │
   │ • Total Cost              │
   └────────┬─────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Patient Reviews & Confirms │
   │ (Double-checks amount)     │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Click "Confirm" in MM      │
   │ Transaction Sent           │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────────┐
   │ POST /api/appointments/create  │
   │ POST /api/appointments/payment │
   │ Record: Form Data              │
   │ Record: Transaction Hash       │
   │ Set Status: "Pending"          │
   └────────┬──────────────────────┘
            │
   ┌────────▼──────────────────┐
   │ ✅ Confirmation Page       │
   │ Appointment Booked!        │
   │ Status: Pending Approval   │
   │ Can View Appointment       │
   └────────────────────────────┘

5. TRACK STATUS
   ┌──────────────────┐
   │ Go to            │
   │ "My Appointments"│
   └────────┬─────────┘
            │
   ┌────────▼──────────────────┐
   │ See Appointment List       │
   │ Real-time Polling         │
   │ (Update Every 10 Sec)     │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Wait for Doctor Approval   │
   │ Status Options:            │
   │ • Pending (Yellow)         │
   │ • Approved (Green)         │
   │ • Rejected (Red)           │
   │ • Completed (Blue)         │
   └────────────────────────────┘
```

---

## Doctor Appointment Approval Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOCTOR APPROVAL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

1. DOCTOR REGISTRATION
   ┌──────────────────┐
   │ Click Register   │
   └────────┬─────────┘
            │
   ┌────────▼──────────────────┐
   │ Connect MetaMask           │
   │ (Different Wallet)         │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Select "Doctor" Role       │
   │ Enter Full Name            │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Sign Message               │
   │ (MetaMask Signature)       │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ POST /api/auth/register    │
   │ Create User Record         │
   │ Create Doctor Profile      │
   │ (Auto-generate License)    │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ ✅ Doctor Dashboard        │
   │ (Appointments View)        │
   └────────────────────────────┘

2. VIEW APPOINTMENTS
   ┌──────────────────────┐
   │ Doctor Dashboard     │
   │ GET /api/appointments
   │ (Polling Every 10s)  │
   └────────┬─────────────┘
            │
   ┌────────▼──────────────────┐
   │ New Appointment Appears    │
   │ Shows:                     │
   │ • Patient Name             │
   │ • Date Requested           │
   │ • Fee Amount               │
   │ • Payment Status           │
   │ • "View Details" Button    │
   └────────┬──────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Click "View Details"       │
   │ GET /api/appointments/[id] │
   └────────┬──────────────────┘
            │
   ┌────────▼────────────────────────────────┐
   │ Appointment Detail Page Shows:           │
   │ • Patient Name, Age, Gender              │
   │ • Symptoms & Medical History             │
   │ • Allergies                              │
   │ • Blood Group                            │
   │ • Payment Amount & Status                │
   │ • Wallet Address                         │
   │ • Buttons: Approve / Reject / Hold       │
   └────────┬───────────────────────────────┘
            │
   ┌────────▼──────────────────┐
   │ Doctor Reviews Details     │
   │ (Reads Patient Info)       │
   └────────┬──────────────────┘

3. DECISION MAKING
   ┌────────────────────────────┐
   │ Doctor Has 3 Options:      │
   │                            │
   │ ✅ APPROVE                 │
   │    ├─ Click "Approve"      │
   │    ├─ Status: Approved     │
   │    └─ Patient Notified     │
   │                            │
   │ ❌ REJECT                  │
   │    ├─ Click "Reject"       │
   │    ├─ Status: Rejected     │
   │    └─ Patient Can Rebook   │
   │                            │
   │ ⏸️ HOLD                    │
   │    ├─ Click "Hold"         │
   │    ├─ Status: On Hold      │
   │    └─ Decide Later         │
   └────────┬───────────────────┘
            │
   ┌────────▼─────────────────────┐
   │ PATCH /api/appointments/[id]  │
   │ Update Status in Database     │
   │ Record Decision with Timestamp│
   └────────┬─────────────────────┘
            │
   ┌────────▼──────────────────┐
   │ ✅ Status Updated          │
   │ Patient Sees Change (10s)  │
   │ In Real-Time Dashboard     │
   └────────────────────────────┘

4. MANAGE APPOINTMENTS
   ┌──────────────────────┐
   │ Doctor Can:          │
   │ • View All Appts     │
   │ • Filter by Status   │
   │ • Search Patients    │
   │ • Update Profile     │
   │ • Set Specialization │
   │ • Set Fees           │
   └──────────────────────┘
```

---

## Smart Contract Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN PAYMENT FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│ Patient MetaMask Wallet          │
│ Balance: 5.0 ETH                 │
└────────────┬─────────────────────┘
             │
             │ (Patient Confirms Payment)
             │
┌────────────▼─────────────────────┐
│ MetaMask Transaction Details      │
│ To: Doctor Wallet                 │
│ Amount: 0.01 ETH                  │
│ Gas: 0.001 ETH                    │
│ Total: 0.011 ETH                  │
└────────────┬─────────────────────┘
             │
             │ (Patient Signs)
             │
┌────────────▼─────────────────────────────────────────┐
│              ETHEREUM BLOCKCHAIN                      │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ Smart Contract: DoctorAppointmentPayment     │    │
│  │                                              │    │
│  │ payForAppointment(appointmentId)             │    │
│  │ {                                            │    │
│  │   - Verify appointment exists               │    │
│  │   - Verify amount matches                   │    │
│  │   - Mark as paid                            │    │
│  │   - Add to doctorBalances[doctor]          │    │
│  │   - Emit PaymentReceived event              │    │
│  │ }                                            │    │
│  └──────────────────┬──────────────────────────┘    │
│                     │                               │
│                     │ Transaction Processed         │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐   │
│  │ Transaction Hash Generated                   │   │
│  │ 0x123456789abcdef...                        │   │
│  │                                              │   │
│  │ Status: Pending (6 blocks to confirm)       │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
└─────────────────────┼───────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────▼─────────────┐    ┌────────▼──────────────┐
│ Doctor Wallet       │    │ Database Backend      │
│ Balance: +0.01 ETH  │    │                       │
│ (Confirmed)         │    │ POST /api/payment     │
│                     │    │ • Store tx hash       │
│ Total: 5.01 ETH     │    │ • Mark paid           │
└─────────────────────┘    │ • Update status       │
                           │ • Create appointment  │
                           │ (Status: Approved)    │
                           └────────┬──────────────┘
                                    │
                           ┌────────▼──────────────┐
                           │ ✅ Payment Complete   │
                           │ • DB Updated          │
                           │ • Patient Notified    │
                           │ • Appointment Active  │
                           │ • On Etherscan (View) │
                           └───────────────────────┘

Transaction Verification Steps:
1. Patient confirms in MetaMask
2. ETH sent to doctor's wallet address
3. Smart contract records appointment
4. Database updates with tx hash
5. Status changes to "Confirmed"
6. View on Etherscan with block # and status
```

---

## Real-Time Update Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    POLLING-BASED REAL-TIME UPDATES                      │
└─────────────────────────────────────────────────────────────────────────┘

Patient Dashboard (My Appointments)
┌────────────────────────────────┐
│ Component Loads                │
│ setInterval every 10 seconds   │
└────────────────┬───────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
  ┌───▼──────┐         ┌────▼──────┐
  │ Tick 0s  │         │ Tick 10s   │
  └───┬──────┘         └────┬───────┘
      │                     │
  ┌───▼──────────────┐  ┌───▼──────────────┐
  │ GET /api/        │  │ GET /api/        │
  │ appointments     │  │ appointments     │
  │ (Initial)        │  │ (Update Check)   │
  └───┬──────────────┘  └───┬──────────────┘
      │                     │
  ┌───▼──────────────┐  ┌───▼──────────────┐
  │ Status: Pending  │  │ Status: Approved │
  │ (Doctor hasn't   │  │ (Doctor said yes)│
  │  decided yet)    │  │                  │
  │                  │  │ UI Updates!      │
  │ Show Yellow ⏳    │  │ Show Green ✅     │
  │ "Awaiting..."    │  │ "Approved!"      │
  └──────────────────┘  └────────────────┘

Doctor Dashboard (New Requests)
┌────────────────────────────────┐
│ Component Loads                │
│ setInterval every 10 seconds   │
└────────────────┬───────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
  ┌───▼──────┐         ┌────▼──────┐
  │ Tick 0s  │         │ Tick 10s   │
  │          │         │            │
  └───┬──────┘         └────┬───────┘
      │                     │
  ┌───▼──────────────┐  ┌───▼──────────────┐
  │ GET /api/        │  │ GET /api/        │
  │ appointments     │  │ appointments     │
  │ (No new appts)   │  │ (NEW APPT!)      │
  │ Empty list       │  │                  │
  │ "No requests"    │  │ NEW CARD appears!│
  │                  │  │ With patient     │
  │                  │  │ details          │
  │                  │  │ Approve/Reject   │
  └──────────────────┘  │ buttons          │
                        └────────────────┘

Database Updates:
┌──────────────────────────────────┐
│ When Doctor Clicks "Approve":     │
│                                  │
│ PATCH /api/appointments/[id]    │
│ { status: "approved" }           │
│                                  │
│ Database Updated Immediately     │
│                                  │
│ Next Poll (in 10 seconds):       │
│ Patient Dashboard Sees Change    │
└──────────────────────────────────┘

Polling Intervals:
- Patient My Appointments: 10 seconds
- Doctor Dashboard: 10 seconds
- Payment Status: Check after tx
- Organ Donation: On demand + refresh

Pros:
✅ Simple implementation
✅ Works with any database
✅ No real-time server needed
✅ Low infrastructure cost

Cons:
❌ 10-second delay (by design)
❌ More database queries
❌ Not instant updates

Could Upgrade to:
- WebSockets (Socket.io)
- Server-Sent Events (SSE)
- Firebase Realtime
```

---

## Database Relationships

```
┌────────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                                  │
└────────────────────────────────────────────────────────────────────┘

users (1)
┌─────────────────────────────────┐
│ id (PK)                         │
│ walletAddress (UNIQUE)          │◄────────────────┐
│ role (patient/doctor/admin)     │                 │
│ fullName                        │                 │
│ email                           │                 │
│ createdAt                       │                 │
└─────────────────────────────────┘                 │
        │                                           │
        │ (1:1 relationship)                        │
        │                                           │
    ┌───┴────────────────────────────┐              │
    │                                │              │
    ▼                                ▼              │
┌─────────────────────┐  ┌──────────────────────┐  │
│ patient_profiles    │  │ doctor_profiles      │  │
├─────────────────────┤  ├──────────────────────┤  │
│ id (PK)             │  │ id (PK)              │  │
│ userId (FK)         │  │ userId (FK) ─────────┼──┘
│ createdAt           │  │ specialization       │
│                     │  │ licenseNumber        │
│                     │  │ yearsOfExperience    │
│                     │  │ consultationFee      │
│                     │  │ qualifications       │
│                     │  │ isVerified           │
└─────────────────────┘  └──────────────────────┘
        │                        │
        │ (1:N)                  │ (1:N)
        │                        │
    ┌───┴────────────────────────┴───┐
    │                                 │
    ▼                                 ▼
┌────────────────────────────────────────────┐
│ appointments                               │
├────────────────────────────────────────────┤
│ id (PK)                                    │
│ patientId (FK) ──► patient_profiles       │
│ doctorId (FK) ──► doctor_profiles         │
│ appointmentDate                            │
│ symptoms                                   │
│ allergies                                  │
│ bloodGroup                                 │
│ medicalHistory                             │
│ status (pending/approved/rejected)         │
│ consultationFee                            │
│ createdAt                                  │
└────────────────────────────────────────────┘
        │
        │ (1:N)
        │
        ▼
┌────────────────────────────────────────────┐
│ payments                                   │
├────────────────────────────────────────────┤
│ id (PK)                                    │
│ appointmentId (FK) ──► appointments       │
│ patientAddress                             │
│ doctorAddress                              │
│ amountEth                                  │
│ transactionHash                            │
│ blockNumber                                │
│ status (pending/confirmed/failed)          │
│ createdAt                                  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ organ_donations                            │
├────────────────────────────────────────────┤
│ id (PK)                                    │
│ patientId (FK) ──► patient_profiles       │
│ doctorId (FK) ──► doctor_profiles         │
│ heart (BOOLEAN)                            │
│ lungs (BOOLEAN)                            │
│ kidneys (BOOLEAN)                          │
│ liver (BOOLEAN)                            │
│ pancreas (BOOLEAN)                         │
│ emergencyContact                           │
│ emergencyPhone                             │
│ registeredAt                               │
│ createdAt                                  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ specialties (ENUM)                         │
├────────────────────────────────────────────┤
│ Values:                                    │
│ • cardiology                               │
│ • neurology                                │
│ • orthopedics                              │
│ • dermatology                              │
│ • ophthalmology                            │
│ • otolaryngology                           │
│ • gastroenterology                         │
│ • pulmonology                              │
│ • nephrology                               │
│ • rheumatology                             │
│ • endocrinology                            │
│ • psychiatry                               │
│ • general_medicine                         │
│ • surgery                                  │
│ • pediatrics                               │
│ • obstetrics_gynecology                    │
└────────────────────────────────────────────┘
```

---

## User Flow Summary

```
START
│
├─ NEW USER
│  │
│  ├─ Patient Path
│  │  ├─ Register (MetaMask)
│  │  ├─ Browse Doctors
│  │  ├─ Select Doctor
│  │  ├─ Fill Form
│  │  ├─ Pay (MetaMask)
│  │  ├─ Confirmation
│  │  └─ Track Status (Polling)
│  │
│  └─ Doctor Path
│     ├─ Register (MetaMask)
│     ├─ Setup Profile
│     ├─ Set Specialization
│     ├─ Set Consultation Fee
│     └─ Ready to Receive Appointments
│
├─ EXISTING USER
│  │
│  ├─ Patient
│  │  ├─ Login (MetaMask)
│  │  ├─ View Appointments
│  │  ├─ Browse More Doctors
│  │  ├─ Book New Appointment
│  │  └─ Manage Organ Donation
│  │
│  └─ Doctor
│     ├─ Login (MetaMask)
│     ├─ View Requests
│     ├─ View Patient Details
│     ├─ Approve/Reject
│     └─ Manage Profile
│
└─ END
```

---

This system provides a complete, blockchain-integrated appointment booking platform with real-time updates and secure payments!

