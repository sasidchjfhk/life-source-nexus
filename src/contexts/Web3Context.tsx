
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

type WalletStatus = 'disconnected' | 'connecting' | 'connected';

interface Web3ContextType {
  walletAddress: string | null;
  walletStatus: WalletStatus;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mintNFTBadge: (badgeName: string) => Promise<string>;
  isOnBlockchain: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('disconnected');
  const [isOnBlockchain, setIsOnBlockchain] = useState(false);

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

  return (
    <Web3Context.Provider 
      value={{
        walletAddress,
        walletStatus,
        connectWallet,
        disconnectWallet,
        mintNFTBadge,
        isOnBlockchain
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
