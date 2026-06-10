# Testing Guide - Doctor Appointment Blockchain System

Complete testing procedures for all features.

## Prerequisites

- ✅ Development server running (`pnpm dev`)
- ✅ `.env.local` configured with all variables
- ✅ Smart contract deployed (have contract address)
- ✅ MetaMask installed with test ETH (Sepolia)
- ✅ Two different wallet addresses available

---

## Phase 1: Authentication Testing

### Test 1.1: Patient Registration

**Steps:**
1. Navigate to http://localhost:3000
2. Click "Register"
3. Click "Connect MetaMask Wallet"
4. Approve connection in MetaMask
5. Select "Patient"
6. Enter full name: "John Doe"
7. Click "Register"
8. Sign message in MetaMask popup

**Expected Results:**
- ✅ Wallet connects successfully
- ✅ Message signs without errors
- ✅ Redirected to patient dashboard
- ✅ User data displays correctly

**Success Criteria:**
- No "Registration failed" error
- Dashboard loads with doctor list
- User info visible in session

---

### Test 1.2: Doctor Registration

**Steps:**
1. Click "Sign In" → "Don't have account?" → "Register"
2. Disconnect from previous wallet (use new wallet or MetaMask account)
3. Connect MetaMask (different address)
4. Select "Doctor"
5. Enter name: "Dr. Smith"
6. Click "Register"

**Expected Results:**
- ✅ Doctor dashboard loads
- ✅ Different UI from patient
- ✅ Profile setup option available

---

### Test 1.3: Login After Registration

**Steps:**
1. Register patient (Test 1.1)
2. Note the wallet address used
3. Logout (if logout button exists)
4. Click "Sign In"
5. Connect same wallet
6. Sign message
7. Should login to patient dashboard

**Expected Results:**
- ✅ Existing user recognized
- ✅ Previous session restored
- ✅ No re-registration needed

---

## Phase 2: Patient Features Testing

### Test 2.1: Browse Doctors by Specialty

**Steps:**
1. Login as patient
2. View dashboard
3. Look for doctor list
4. Check different specializations

**Expected Results:**
- ✅ Doctors display by specialty
- ✅ At least 5 specialties visible
- ✅ Doctor details shown (name, specialty, fee)

**Test Data:**
- Specialties: Cardiology, Neurology, Orthopedics, Dermatology, etc.
- Consultation fees shown in ETH or decimal format

---

### Test 2.2: Book Appointment - Form Validation

**Steps:**
1. Login as patient
2. Click on any doctor
3. Try submitting empty form
4. Fill only name field
5. Submit again

**Expected Results:**
- ✅ Empty form shows validation error
- ✅ Partial form shows validation error
- ✅ Clear error messages displayed

**Test Fields:**
- Full Name (required)
- Age (required)
- Gender (required)
- Blood Group (required)
- Symptoms (required)
- Allergies (optional)
- Medical History (optional)

---

### Test 2.3: Complete Appointment Booking

**Steps:**
1. Login as patient
2. Select doctor
3. Fill all required fields:
   - Name: "Patient Name"
   - Age: "30"
   - Gender: "Male"
   - Blood Group: "O+"
   - Symptoms: "Chest pain"
   - Allergies: "Penicillin"
   - History: "Diabetes"
4. Click "Proceed to Payment"

**Expected Results:**
- ✅ Form validates without errors
- ✅ Payment modal appears
- ✅ Modal shows:
   - Doctor address
   - Consultation fee
   - "Pay with MetaMask" button

---

### Test 2.4: MetaMask Payment Integration

**Steps:**
1. Complete form (Test 2.3)
2. See payment popup with doctor address and fee
3. Click "Proceed to MetaMask"
4. MetaMask popup appears automatically
5. Review transaction details:
   - To: Doctor's wallet address
   - Amount: Consultation fee in ETH
   - Gas: Automatically calculated
6. Click "Confirm" in MetaMask

**Expected Results:**
- ✅ MetaMask opens automatically
- ✅ Transaction details correct
- ✅ Transaction sends successfully
- ✅ Redirected to confirmation page
- ✅ Appointment status shows "Pending"

**Troubleshooting:**
- If MetaMask doesn't open: Check popups aren't blocked
- If transaction fails: Verify test ETH balance
- If fee incorrect: Check contract address in `.env.local`

---

### Test 2.5: View My Appointments

**Steps:**
1. Login as patient (who booked appointments)
2. Navigate to "My Appointments"
3. View appointment list
4. Check each appointment shows:
   - Doctor name
   - Appointment date/time
   - Status (Pending/Approved/Rejected)
   - Patient details
   - Payment status

**Expected Results:**
- ✅ Booked appointments display
- ✅ Real-time status updates
- ✅ Status changes within 10 seconds of doctor action

---

### Test 2.6: Organ Donation Form

**Steps:**
1. Login as patient
2. Navigate to "Organ Donation" page
3. Fill form:
   - Select preferred doctor
   - Check organs to donate (heart, kidney, liver, etc.)
   - Enter emergency contact
   - Read disclaimer
   - Click "Register"

**Expected Results:**
- ✅ Form validation works
- ✅ Submission succeeds
- ✅ Confirmation message appears
- ✅ Form data saved to database
- ✅ Accessible to assigned doctor

---

## Phase 3: Doctor Features Testing

### Test 3.1: Doctor Dashboard

**Steps:**
1. Login as doctor
2. View dashboard
3. Check appointment requests section

**Expected Results:**
- ✅ Dashboard loads
- ✅ Shows all pending appointments
- ✅ Real-time updates (if patient books appointment, appears in 10 seconds)
- ✅ Shows patient count, appointment count

---

### Test 3.2: View Appointment Request

**Steps:**
1. Login as doctor
2. Have patient book appointment (use different wallet)
3. Doctor dashboard refreshes (or click refresh)
4. New appointment appears in list
5. Click on appointment to view details

**Expected Results:**
- ✅ Appointment appears after booking
- ✅ Shows patient info:
   - Name
   - Age
   - Gender
   - Symptoms
   - Allergies
   - Blood Group
   - Medical history
- ✅ Shows payment amount and patient wallet

---

### Test 3.3: Approve/Reject Appointment

**Steps:**
1. Doctor views appointment request
2. Click "Approve" button
3. Switch to patient tab
4. Check status update (within 10 seconds)

**Alternative Step 3:**
- Go back and click "Reject"
- Check patient sees "Rejected" status

**Expected Results:**
- ✅ Approval processes without error
- ✅ Patient sees "Approved" status update
- ✅ Rejection also works
- ✅ Status changes visible in real-time (polling)

---

### Test 3.4: Doctor Profile Setup

**Steps:**
1. Doctor logs in
2. Navigate to "Profile"
3. Update profile:
   - Specialization: "Cardiology"
   - License Number: "LIC123456"
   - Years of Experience: "10"
   - Consultation Fee: "0.01" (ETH)
   - Qualifications: "MD, Board Certified"
   - Bio: "10+ years experience in cardiac care"
4. Click "Save Profile"

**Expected Results:**
- ✅ Form validates
- ✅ Updates saved
- ✅ Profile visible to patients
- ✅ Consultation fee applies to new bookings

---

### Test 3.5: View Organ Donation Registry

**Steps:**
1. Doctor logs in
2. Patient registers organ donation with this doctor
3. Doctor checks for organ donation section
4. View registered patients' donation info

**Expected Results:**
- ✅ Can view organ donors under their care
- ✅ Shows organs they agreed to donate
- ✅ Shows patient emergency contact
- ✅ Data is accurate

---

## Phase 4: Real-Time Polling Testing

### Test 4.1: Real-Time Appointment Status

**Steps:**
1. Open browser window 1: Doctor dashboard
2. Open browser window 2: Patient's "My Appointments"
3. In window 2: Patient books new appointment
4. Doctor (window 1) sees appointment appear within 10 seconds
5. Doctor approves appointment
6. Patient (window 2) sees status change within 10 seconds

**Expected Results:**
- ✅ New appointments appear in doctor dashboard quickly
- ✅ Status changes propagate in real-time
- ✅ No page refresh needed
- ✅ Both sides stay synchronized

---

## Phase 5: Error Handling Testing

### Test 5.1: Insufficient Balance

**Steps:**
1. Patient tries to book appointment with 0.05 ETH fee
2. But wallet has less than 0.05 ETH
3. Attempt payment

**Expected Results:**
- ✅ MetaMask shows "insufficient funds" error
- ✅ Transaction doesn't process
- ✅ Appointment not created
- ✅ User can try again after adding funds

---

### Test 5.2: Invalid Wallet Address

**Steps:**
1. Try to register with invalid wallet
2. Clear payment modal address field
3. Enter invalid address format

**Expected Results:**
- ✅ Form validation catches errors
- ✅ Clear error message shown
- ✅ Can't proceed without valid address

---

### Test 5.3: Network Mismatch

**Steps:**
1. Set .env to use Mainnet RPC
2. Have MetaMask on Sepolia network
3. Try to perform any blockchain action

**Expected Results:**
- ✅ Clear error: "Wrong network"
- ✅ Suggest switching to correct network
- ✅ Provide one-click network switch

---

## Phase 6: Database Testing

### Test 6.1: Data Persistence

**Steps:**
1. Create appointment with patient
2. Refresh browser
3. Check appointment still exists

**Expected Results:**
- ✅ Appointment persists after refresh
- ✅ All data intact
- ✅ Database connection working

---

### Test 6.2: Multiple Concurrent Users

**Steps:**
1. Open 3 browser windows (3 patients)
2. All simultaneously book appointments with same doctor
3. Switch to doctor window
4. Refresh dashboard

**Expected Results:**
- ✅ All 3 appointments appear
- ✅ No data loss
- ✅ Database handles concurrent writes
- ✅ No duplicate entries

---

## Phase 7: Smart Contract Testing

### Test 7.1: Verify Contract On-Chain

**Steps:**
1. Patient makes payment
2. Go to Etherscan: https://sepolia.etherscan.io/
3. Search for contract address
4. Click "Transactions" tab
5. Find recent transaction
6. Verify payment amount
7. Verify sender (patient) and recipient (doctor) addresses

**Expected Results:**
- ✅ Transaction appears on Etherscan
- ✅ Amount is correct
- ✅ Addresses match
- ✅ Status shows "Success"

---

### Test 7.2: Contract Balance Tracking

**Steps:**
1. Doctor receives payment from patient
2. Go to Remix IDE or Etherscan
3. Call `getDoctorBalance(doctorAddress)`
4. Verify balance increased by payment amount

**Expected Results:**
- ✅ Contract tracks doctor balance correctly
- ✅ Multiple payments accumulate
- ✅ Balance = sum of all received payments

---

## Test Summary Checklist

- [ ] Patient Registration
- [ ] Doctor Registration
- [ ] Login Flow
- [ ] Browse Doctors
- [ ] Book Appointment
- [ ] Form Validation
- [ ] MetaMask Payment
- [ ] View My Appointments
- [ ] Organ Donation Form
- [ ] Doctor Dashboard
- [ ] View Patient Request
- [ ] Approve/Reject
- [ ] Update Doctor Profile
- [ ] Real-Time Updates
- [ ] Error Handling
- [ ] Data Persistence
- [ ] Smart Contract Verification

---

## Performance Testing

### Test Load Times
```
Expected benchmarks:
- Home page load: < 2s
- Dashboard load: < 3s
- Appointment form: < 1s
- Payment modal: < 0.5s
- Real-time update: < 10s
```

### Test With Chrome DevTools
1. Open DevTools (F12)
2. Go to Performance tab
3. Record user action
4. Check if timing is acceptable

---

## Known Limitations

1. **Polling Delay**: Real-time updates have ~10 second delay (by design)
2. **Sepolia Only**: Use Sepolia testnet for safe testing
3. **No Offline Mode**: Requires blockchain connection
4. **ETH Cost**: Mainnet deployments cost real ETH

---

## Support

If tests fail:
1. Check `.env.local` is correct
2. Verify smart contract is deployed
3. Ensure MetaMask is on correct network
4. Check browser console for errors (F12)
5. Restart dev server
6. Clear browser cache

