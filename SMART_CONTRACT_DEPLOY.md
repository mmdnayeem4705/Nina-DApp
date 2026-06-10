# Smart Contract Deployment Guide

This guide provides step-by-step instructions to deploy the Doctor Appointment Payment smart contract.

## Quick Start (Remix IDE - 5 minutes)

### Step 1: Open Remix IDE
Go to https://remix.ethereum.org/ in your browser.

### Step 2: Create Contract File
1. Click the **File Explorer** icon (top left)
2. Right-click in the file explorer
3. Select "New File"
4. Name it: `DoctorAppointmentPayment.sol`

### Step 3: Copy Contract Code
Copy the entire contract code from below and paste it into the Remix editor:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DoctorAppointmentPayment
 * @dev Handles payments for doctor appointments with blockchain verification
 */
contract DoctorAppointmentPayment {
    
    // Struct to store appointment details
    struct Appointment {
        address patient;
        address doctor;
        uint256 amount;
        uint256 timestamp;
        bool paid;
        string appointmentId;
    }
    
    // State variables
    mapping(string => Appointment) public appointments;
    mapping(address => uint256) public doctorBalances;
    mapping(string => bool) public appointmentExists;
    
    address public contractOwner;
    
    // Events
    event AppointmentCreated(
        string indexed appointmentId,
        address indexed patient,
        address indexed doctor,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentReceived(
        string indexed appointmentId,
        address indexed patient,
        address indexed doctor,
        uint256 amount,
        uint256 timestamp
    );
    
    event BalanceWithdrawn(
        address indexed doctor,
        uint256 amount,
        uint256 timestamp
    );
    
    // Constructor
    constructor() {
        contractOwner = msg.sender;
    }
    
    /**
     * @dev Create an appointment record on blockchain
     * @param appointmentId Unique appointment ID
     * @param doctorAddress Address of the doctor
     * @param amountInWei Payment amount in wei
     */
    function createAppointment(
        string memory appointmentId,
        address doctorAddress,
        uint256 amountInWei
    ) external {
        require(doctorAddress != address(0), "Invalid doctor address");
        require(amountInWei > 0, "Amount must be greater than 0");
        require(!appointmentExists[appointmentId], "Appointment already exists");
        
        appointments[appointmentId] = Appointment({
            patient: msg.sender,
            doctor: doctorAddress,
            amount: amountInWei,
            timestamp: block.timestamp,
            paid: false,
            appointmentId: appointmentId
        });
        
        appointmentExists[appointmentId] = true;
        
        emit AppointmentCreated(
            appointmentId,
            msg.sender,
            doctorAddress,
            amountInWei,
            block.timestamp
        );
    }
    
    /**
     * @dev Pay for an appointment using this function
     * @param appointmentId The appointment ID to pay for
     */
    function payForAppointment(string memory appointmentId) external payable {
        require(appointmentExists[appointmentId], "Appointment does not exist");
        
        Appointment storage appointment = appointments[appointmentId];
        
        require(!appointment.paid, "Appointment already paid");
        require(msg.sender == appointment.patient, "Only patient can pay");
        require(msg.value == appointment.amount, "Payment amount does not match");
        
        // Mark as paid
        appointment.paid = true;
        
        // Add to doctor's balance
        doctorBalances[appointment.doctor] += msg.value;
        
        emit PaymentReceived(
            appointmentId,
            msg.sender,
            appointment.doctor,
            msg.value,
            block.timestamp
        );
    }
    
    /**
     * @dev Get appointment details
     * @param appointmentId The appointment ID
     */
    function getAppointmentDetails(string memory appointmentId) 
        external 
        view 
        returns (Appointment memory) 
    {
        require(appointmentExists[appointmentId], "Appointment does not exist");
        return appointments[appointmentId];
    }
    
    /**
     * @dev Get doctor's available balance for withdrawal
     * @param doctorAddress Address of the doctor
     */
    function getDoctorBalance(address doctorAddress) 
        external 
        view 
        returns (uint256) 
    {
        return doctorBalances[doctorAddress];
    }
    
    /**
     * @dev Withdraw balance (for doctors)
     */
    function withdrawBalance() external {
        uint256 balance = doctorBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        doctorBalances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit BalanceWithdrawn(msg.sender, balance, block.timestamp);
    }
    
    /**
     * @dev Check if an appointment has been paid
     * @param appointmentId The appointment ID
     */
    function isAppointmentPaid(string memory appointmentId) 
        external 
        view 
        returns (bool) 
    {
        require(appointmentExists[appointmentId], "Appointment does not exist");
        return appointments[appointmentId].paid;
    }
    
    /**
     * @dev Receive ETH directly (fallback)
     */
    receive() external payable {
        // Contract can receive ETH
    }
}
```

### Step 4: Compile Contract
1. Click the **Solidity Compiler** icon (left sidebar)
2. Set compiler version to **0.8.19** or higher
3. Click **"Compile DoctorAppointmentPayment.sol"**
4. You should see a green checkmark ✓

### Step 5: Deploy to Testnet (Sepolia - Recommended for Testing)

#### Switch MetaMask to Sepolia
1. Open MetaMask browser extension
2. Click network dropdown at top
3. Select "Sepolia test network"
4. Get free test ETH from: https://sepoliafaucet.com

#### Deploy in Remix
1. Click **Deploy & Run Transactions** icon (left sidebar)
2. Environment: Select **"Injected Provider - MetaMask"**
3. Your MetaMask wallet will connect
4. Click **"Deploy"** button (orange button with contract name)
5. Confirm transaction in MetaMask popup
6. **Wait for confirmation** (takes 15-30 seconds)

### Step 6: Copy Contract Address

After successful deployment:
1. In the **Deployed Contracts** section (bottom left)
2. Click the copy icon next to the contract address
3. Save this address - it looks like: `0x1234567890abcdef...`
4. Add this to your `.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
   ```

---

## Deploy to Ethereum Mainnet (For Production)

⚠️ **WARNING**: This uses **real ETH**. Only do this after thorough testing on Sepolia!

### Prerequisites
1. Have ETH in your wallet (at least 0.01 ETH for gas fees)
2. Complete testing on Sepolia Testnet first
3. Understand deployment costs

### Steps
1. In Remix, switch MetaMask network to **Ethereum Mainnet**
2. Ensure you have sufficient ETH balance
3. Click **Deploy**
4. Confirm transaction (review gas fees carefully)
5. Wait for confirmation on Etherscan
6. Copy the contract address and update `.env.local`

---

## Advanced: Deploy Using Hardhat (For Developers)

### Setup
```bash
# Create project directory
mkdir doctor-appointment-contract
cd doctor-appointment-contract

# Initialize npm
npm init -y

# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox ethers
npx hardhat
```

### Create Contract
Create `contracts/DoctorAppointmentPayment.sol` and paste the Solidity code above.

### Create Deploy Script
Create `scripts/deploy.js`:

```javascript
async function main() {
  console.log("Deploying DoctorAppointmentPayment...");
  
  const DoctorAppointment = await ethers.getContractFactory("DoctorAppointmentPayment");
  const contract = await DoctorAppointment.deploy();
  
  await contract.deployed();
  
  console.log("Contract deployed to:", contract.address);
  console.log("\nAdd this to your .env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Configure Network
Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://rpc.sepolia.dev`,
      accounts: ["YOUR_PRIVATE_KEY_HERE"] // Get from MetaMask
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/YOUR_INFURA_KEY`,
      accounts: ["YOUR_PRIVATE_KEY_HERE"]
    }
  }
};
```

### Deploy
```bash
# Deploy to Sepolia (Testnet)
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Mainnet (Production)
npx hardhat run scripts/deploy.js --network mainnet
```

---

## Verify Contract on Etherscan

### Steps:
1. Go to Etherscan (Sepolia: https://sepolia.etherscan.io, Mainnet: https://etherscan.io)
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Paste the Solidity code
6. Set compiler version to 0.8.19
7. Submit

This allows users to view and verify the contract code on Etherscan.

---

## Testing the Contract

### In Remix IDE:
1. After deployment, scroll down to "Deployed Contracts"
2. Test functions:
   - `createAppointment(appointmentId, doctorAddress, amountInWei)`
   - `getAppointmentDetails(appointmentId)`
   - `payForAppointment(appointmentId)` (with value in wei)

### Example Test Values:
- **appointmentId**: "APT_12345_001"
- **doctorAddress**: Your wallet address (0x...)
- **amountInWei**: 1000000000000000000 (= 1 ETH)

---

## Troubleshooting

### "Contract not deploying"
- Ensure compiler version is 0.8.19+
- Check MetaMask is unlocked
- Verify you have gas (ETH) in wallet

### "Invalid address" error
- Ensure wallet address is valid (starts with 0x)
- Address should be 42 characters long

### "Insufficient funds"
- For Sepolia: Get free test ETH from https://sepoliafaucet.com
- For Mainnet: Purchase ETH from exchange

### Contract deployed but can't interact
- Refresh Remix page
- Check contract is shown in "Deployed Contracts"
- Ensure MetaMask network matches deployment network

---

## Gas Fee Estimates

### Sepolia Testnet (Free)
- Deployment: 0 cost (test ETH)
- Create Appointment: ~50,000 gas
- Pay for Appointment: ~60,000 gas

### Ethereum Mainnet (Real Costs)
- Deployment: ~0.05 - 0.15 ETH
- Create Appointment: 0.001 - 0.005 ETH
- Pay for Appointment: 0.001 - 0.005 ETH

Costs vary based on network congestion. Check gas.etherscan.io for current rates.

---

## Next Steps

After deployment:
1. ✅ Save contract address
2. ✅ Add to `.env.local`
3. ✅ Restart dev server: `pnpm dev`
4. ✅ Test in browser at http://localhost:3000

