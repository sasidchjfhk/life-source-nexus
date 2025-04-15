
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

type WalletStatus = 'disconnected' | 'connecting' | 'connected';

interface Web3ContextType {
  walletAddress: string | null;
  walletStatus: WalletStatus;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mintNFTBadge: (badgeName: string) => Promise<string>;
  isOnBlockchain: boolean;
  registerOrganDonor: (donorData: any) => Promise<string>;
  verifyHospital: (hospitalId: string) => Promise<boolean>;
  getOrganMatchScore: (donorId: string, recipientId: string) => Promise<number>;
  reportFraud: (entityId: string, reason: string) => Promise<void>;
  checkFraudScore: (entityId: string) => Promise<number>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('disconnected');
  const [isOnBlockchain, setIsOnBlockchain] = useState(false);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletStatus('connected');
      setIsOnBlockchain(true);
    }
  }, []);

  // Simulate wallet connection
  const connectWallet = async (): Promise<void> => {
    setWalletStatus('connecting');
    
    // Simulating connection delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAddress = '0x' + Array(40).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        setWalletAddress(mockAddress);
        setWalletStatus('connected');
        setIsOnBlockchain(true);
        
        // Save wallet address to localStorage
        localStorage.setItem('walletAddress', mockAddress);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`,
        });
        
        resolve();
      }, 1500);
    });
  };

  // Simulate wallet disconnection
  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletStatus('disconnected');
    setIsOnBlockchain(false);
    
    // Remove wallet address from localStorage
    localStorage.removeItem('walletAddress');
    
    toast({
      title: "Wallet Disconnected",
      description: "Your Web3 wallet has been disconnected.",
    });
  };

  // Simulate NFT minting
  const mintNFTBadge = async (badgeName: string): Promise<string> => {
    if (walletStatus !== 'connected') {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      throw new Error("Wallet not connected");
    }
    
    // Simulate minting delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokenId = Math.floor(Math.random() * 1000000).toString();
        
        toast({
          title: "NFT Badge Minted",
          description: `${badgeName} badge successfully minted! Token ID: ${tokenId}`,
        });
        
        resolve(tokenId);
      }, 2000);
    });
  };

  // Simulate organ donor registration on blockchain
  const registerOrganDonor = async (donorData: any): Promise<string> => {
    if (walletStatus !== 'connected') {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      throw new Error("Wallet not connected");
    }
    
    // Simulate blockchain transaction delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactionHash = '0x' + Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        toast({
          title: "Donor Registration Successful",
          description: "Your data has been securely registered on the blockchain.",
        });
        
        resolve(transactionHash);
      }, 3000);
    });
  };

  // Simulate hospital verification on blockchain
  const verifyHospital = async (hospitalId: string): Promise<boolean> => {
    if (walletStatus !== 'connected') {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      throw new Error("Wallet not connected");
    }
    
    // Simulate verification delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% chance of successful verification
        const isVerified = Math.random() < 0.9;
        
        if (isVerified) {
          toast({
            title: "Hospital Verified",
            description: `Hospital ID ${hospitalId} has been verified on the blockchain.`,
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "Hospital could not be verified. Please check the information and try again.",
            variant: "destructive"
          });
        }
        
        resolve(isVerified);
      }, 2500);
    });
  };

  // Simulate AI organ matching
  const getOrganMatchScore = async (donorId: string, recipientId: string): Promise<number> => {
    // Simulate AI processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random match score between 1 and 100
        const matchScore = Math.floor(Math.random() * 100) + 1;
        
        resolve(matchScore);
      }, 1500);
    });
  };

  // Simulate fraud reporting
  const reportFraud = async (entityId: string, reason: string): Promise<void> => {
    if (walletStatus !== 'connected') {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      throw new Error("Wallet not connected");
    }
    
    // Simulate blockchain transaction delay
    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: "Fraud Reported",
          description: `Entity ${entityId} has been reported for potential fraud.`,
        });
        
        resolve();
      }, 2000);
    });
  };

  // Simulate AI fraud detection
  const checkFraudScore = async (entityId: string): Promise<number> => {
    // Simulate AI processing delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random fraud score between 1 and 100
        // Higher score means higher likelihood of fraud
        const fraudScore = Math.floor(Math.random() * 100) + 1;
        
        resolve(fraudScore);
      }, 1000);
    });
  };

  return (
    <Web3Context.Provider 
      value={{
        walletAddress,
        walletStatus,
        connectWallet,
        disconnectWallet,
        mintNFTBadge,
        isOnBlockchain,
        registerOrganDonor,
        verifyHospital,
        getOrganMatchScore,
        reportFraud,
        checkFraudScore
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
