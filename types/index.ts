// MetaMask Provider Types
export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, callback: (data: any) => void) => void;
  removeListener: (eventName: string, callback: (data: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Database Types
export interface User {
  id: number;
  walletAddress: string;
  email?: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  fullName?: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DoctorProfile {
  id: number;
  userId: number;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience?: number;
  qualifications?: string;
  consultationFee: string;
  bio?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PatientProfile {
  id: number;
  userId: number;
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  reason?: string;
  symptoms?: string;
  allergies?: string;
  bloodGroup?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  consultationFee: string;
  paymentTxHash?: string;
  paymentStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrganDonationForm {
  id: number;
  patientId: number;
  doctorId: number;
  organs: string; // JSON array stored as string
  bloodType: string;
  medicalConditions?: string;
  familyConsent: boolean;
  dateOfSubmission?: Date;
  status: 'active' | 'inactive' | 'withdrawn';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentTransaction {
  id: number;
  appointmentId: number;
  patientWalletAddress: string;
  doctorWalletAddress: string;
  amount: string; // ETH amount
  transactionHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  networkId?: number; // 1 for Ethereum Mainnet
  createdAt?: Date;
  updatedAt?: Date;
}
