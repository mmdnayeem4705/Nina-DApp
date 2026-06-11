import { ethers } from 'ethers';

// Smart Contract ABI (minimal ABI for our use case)
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'appointmentId', type: 'string' },
      { internalType: 'address', name: 'doctor', type: 'address' },
    ],
    name: 'payForAppointment',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'doctor', type: 'address' }],
    name: 'getDoctorBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'appointmentId', type: 'string' }],
    name: 'getAppointmentDetails',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'patient', type: 'address' },
          { internalType: 'address', name: 'doctor', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
          { internalType: 'bool', name: 'paid', type: 'bool' },
          { internalType: 'string', name: 'appointmentId', type: 'string' },
        ],
        internalType: 'struct DoctorAppointmentPayment.Appointment',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'appointmentId', type: 'string' },
      { indexed: true, internalType: 'address', name: 'patient', type: 'address' },
      { indexed: true, internalType: 'address', name: 'doctor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'PaymentReceived',
    type: 'event',
  },
] as const;

const DEFAULT_SEPOLIA_RPC_URLS = [
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://rpc2.sepolia.org',
  'https://sepolia.drpc.org',
];

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

let readProvider: ethers.FallbackProvider | null = null;

function getRpcUrls(): string[] {
  const configured = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL?.trim();
  const urls = configured
    ? [configured, ...DEFAULT_SEPOLIA_RPC_URLS.filter((url) => url !== configured)]
    : DEFAULT_SEPOLIA_RPC_URLS;

  return [...new Set(urls)];
}

function getChainConfig() {
  return {
    chainId: CHAIN_ID,
    name: CHAIN_ID === 11155111 ? 'Sepolia' : `Chain ${CHAIN_ID}`,
    blockExplorer:
      CHAIN_ID === 11155111 ? 'https://sepolia.etherscan.io' : undefined,
  };
}

/**
 * Reliable read-only provider with fallback RPC endpoints.
 * Avoids MetaMask's default RPC, which is often rate-limited.
 */
export function getReadProvider(): ethers.FallbackProvider {
  if (readProvider) {
    return readProvider;
  }

  const network = ethers.Network.from(CHAIN_ID);
  readProvider = new ethers.FallbackProvider(
    getRpcUrls().map((url) => new ethers.JsonRpcProvider(url, network)),
    network
  );

  return readProvider;
}

function getContractAddress(): string {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();

  if (!contractAddress || contractAddress.toLowerCase() === ZERO_ADDRESS) {
    throw new Error(
      'Smart contract is not configured. Deploy it with `pnpm deploy:contract` (see VERCEL_DEPLOY.md), set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local or Vercel env vars, then restart/redeploy.'
    );
  }

  if (!ethers.isAddress(contractAddress)) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is not a valid Ethereum address.');
  }

  return contractAddress;
}

function formatEthereumError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Unknown payment error';
  }

  const message = error.message;

  if (
    message.includes('RPC endpoint returned too many errors') ||
    message.includes('-32002') ||
    message.includes('eth_blockNumber')
  ) {
    return 'Network RPC is temporarily unavailable. Switch MetaMask to Sepolia testnet, confirm the transaction in your wallet, then try again.';
  }

  if (message.includes('user rejected') || message.includes('User denied')) {
    return 'Payment cancelled in MetaMask.';
  }

  if (message.includes('insufficient funds')) {
    return 'Insufficient Sepolia ETH for this payment and gas fees. Get test ETH from a Sepolia faucet.';
  }

  if (message.includes('ACTION_REJECTED')) {
    return 'Payment cancelled in MetaMask.';
  }

  if (message.includes('network changed')) {
    return 'Network changed during payment. Please stay on Sepolia and try again.';
  }

  return message;
}

async function waitForTransactionConfirmation(
  txHash: string
): Promise<ethers.TransactionReceipt> {
  const provider = getReadProvider();
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const receipt = await provider.waitForTransaction(txHash, 1, 120_000);

      if (!receipt) {
        throw new Error(
          'Transaction confirmation timed out. Check MetaMask activity or Sepolia Etherscan for status.'
        );
      }

      if (receipt.status === 0) {
        throw new Error('Transaction reverted on chain. Check contract deployment and network.');
      }

      return receipt;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Ensure MetaMask is connected to the configured chain.
 */
export async function ensureCorrectNetwork(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const chainIdHex = (await window.ethereum.request({
    method: 'eth_chainId',
  })) as string;
  const currentChainId = Number.parseInt(chainIdHex, 16);

  if (currentChainId === CHAIN_ID) {
    return;
  }

  const targetChainIdHex = `0x${CHAIN_ID.toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainIdHex }],
    });
  } catch (switchError) {
    const error = switchError as { code?: number };

    if (error.code !== 4902) {
      throw new Error(
        `Please switch MetaMask to ${getChainConfig().name} (chain ID ${CHAIN_ID}) and try again.`
      );
    }

    const chainConfig = getChainConfig();
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: targetChainIdHex,
          chainName: chainConfig.name,
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: getRpcUrls(),
          blockExplorerUrls: chainConfig.blockExplorer
            ? [chainConfig.blockExplorer]
            : undefined,
        },
      ],
    });
  }
}

/**
 * Get MetaMask browser provider instance.
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

/**
 * Get signer instance.
 */
export const getSigner = async () => {
  await ensureCorrectNetwork();
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask not found');
  return provider.getSigner();
};

/**
 * Get contract instance connected to the user's wallet.
 */
export const getContract = async () => {
  const signer = await getSigner();
  const contractAddress = getContractAddress();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
};

/**
 * Request account access from MetaMask.
 */
export const requestAccount = async (): Promise<string> => {
  if (typeof window === 'undefined') throw new Error('Window object not available');
  if (!window.ethereum) throw new Error('MetaMask not installed');

  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  })) as string[];

  return accounts[0];
};

/**
 * Get current connected account.
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  if (!window.ethereum) return null;

  try {
    const accounts = (await window.ethereum.request({
      method: 'eth_accounts',
    })) as string[];
    return accounts?.[0] || null;
  } catch {
    return null;
  }
};

/**
 * Get account balance in ETH using the fallback RPC provider.
 */
export const getAccountBalance = async (address: string): Promise<string> => {
  const balance = await getReadProvider().getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Pay for appointment.
 */
export const payForAppointment = async (
  appointmentId: string,
  doctorAddress: string,
  amountInETH: string
): Promise<string> => {
  if (!ethers.isAddress(doctorAddress)) {
    throw new Error('Doctor wallet address is invalid.');
  }

  await ensureCorrectNetwork();

  const signer = await getSigner();
  const contractAddress = getContractAddress();
  const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

  try {
    const tx = await contract.payForAppointment(appointmentId, doctorAddress, {
      value: ethers.parseEther(amountInETH),
    });

    const receipt = await waitForTransactionConfirmation(tx.hash);
    return receipt.hash;
  } catch (error) {
    throw new Error(`Payment failed: ${formatEthereumError(error)}`);
  }
};

/**
 * Sign message for authentication.
 */
export const signMessage = async (message: string): Promise<string> => {
  const signer = await getSigner();
  return signer.signMessage(message);
};

/**
 * Verify signed message.
 */
export const verifyMessage = async (
  message: string,
  signature: string,
  address: string
): Promise<boolean> => {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === address.toLowerCase();
};

/**
 * Format address for display.
 */
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Check if MetaMask is available.
 */
export const isMetaMaskAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ethereum !== 'undefined';
};

/**
 * Listen to network change.
 */
export const onNetworkChange = (callback: (chainId: string) => void) => {
  if (typeof window === 'undefined') return;
  if (!window.ethereum) return;

  window.ethereum.on('chainChanged', callback);
};

/**
 * Listen to account change.
 */
export const onAccountChange = (callback: (accounts: string[]) => void) => {
  if (typeof window === 'undefined') return;
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', callback);
};
