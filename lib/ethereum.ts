import { ethers } from 'ethers';

// Smart Contract ABI (minimal ABI for our use case)
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "appointmentId", "type": "string" },
      { "internalType": "address", "name": "doctor", "type": "address" }
    ],
    "name": "payForAppointment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "doctor", "type": "address" }],
    "name": "getDoctorBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "appointmentId", "type": "string" }],
    "name": "getAppointmentDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "patient", "type": "address" },
          { "internalType": "address", "name": "doctor", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "bool", "name": "paid", "type": "bool" },
          { "internalType": "string", "name": "appointmentId", "type": "string" }
        ],
        "internalType": "struct DoctorAppointmentPayment.Appointment",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "string", "name": "appointmentId", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "PaymentReceived",
    "type": "event"
  }
];

/**
 * Get provider instance
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

/**
 * Get signer instance
 */
export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask not found');
  return provider.getSigner();
};

/**
 * Get contract instance
 */
export const getContract = async () => {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask not found');
  
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error('Contract address not configured');
  
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
};

/**
 * Request account access from MetaMask
 */
export const requestAccount = async (): Promise<string> => {
  if (typeof window === 'undefined') throw new Error('Window object not available');
  if (!window.ethereum) throw new Error('MetaMask not installed');
  
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  
  return accounts[0];
};

/**
 * Get current connected account
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts?.[0] || null;
  } catch {
    return null;
  }
};

/**
 * Get account balance in ETH
 */
export const getAccountBalance = async (address: string): Promise<string> => {
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');
  
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Pay for appointment
 */
export const payForAppointment = async (
  appointmentId: string,
  doctorAddress: string,
  amountInETH: string
): Promise<string> => {
  const contract = await getContract();
  
  try {
    const tx = await contract.payForAppointment(appointmentId, doctorAddress, {
      value: ethers.parseEther(amountInETH),
    });
    
    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Sign message for authentication
 */
export const signMessage = async (message: string): Promise<string> => {
  const signer = await getSigner();
  return signer.signMessage(message);
};

/**
 * Verify signed message
 */
export const verifyMessage = async (message: string, signature: string, address: string): Promise<boolean> => {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === address.toLowerCase();
};

/**
 * Format address for display
 */
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Check if MetaMask is available
 */
export const isMetaMaskAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ethereum !== 'undefined';
};

/**
 * Listen to network change
 */
export const onNetworkChange = (callback: (chainId: string) => void) => {
  if (typeof window === 'undefined') return;
  if (!window.ethereum) return;
  
  window.ethereum.on('chainChanged', callback);
};

/**
 * Listen to account change
 */
export const onAccountChange = (callback: (accounts: string[]) => void) => {
  if (typeof window === 'undefined') return;
  if (!window.ethereum) return;
  
  window.ethereum.on('accountsChanged', callback);
};
