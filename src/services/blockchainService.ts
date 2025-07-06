import { ethers } from 'ethers';

// Smart contract ABI for OrganMatchLog
const CONTRACT_ABI = [
  "function logMatch(string donorId, string recipientId, uint256 matchScore) public",
  "event MatchLogged(address indexed hospital, string donorId, string recipientId, uint256 matchScore, uint256 timestamp)"
];

export interface BlockchainConfig {
  contractAddress: string;
  rpcUrl?: string;
  privateKey?: string;
}

export class BlockchainService {
  private contract: ethers.Contract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // Try to use MetaMask first
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = await (this.provider as ethers.BrowserProvider).getSigner();
      }
      // Fallback to RPC provider with private key
      else if (this.config.rpcUrl && this.config.privateKey) {
        this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
        this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
      } else {
        throw new Error('No Ethereum provider available');
      }

      this.contract = new ethers.Contract(
        this.config.contractAddress,
        CONTRACT_ABI,
        this.signer
      );
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  async logMatch(donorId: string, recipientId: string, matchScore: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      // Convert match score to integer (multiply by 100 to preserve 2 decimal places)
      const scoreAsInt = Math.round(matchScore * 100);
      
      const tx = await this.contract.logMatch(donorId, recipientId, scoreAsInt);
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      await tx.wait();
      console.log('Transaction confirmed:', tx.hash);
      
      return tx.hash;
    } catch (error) {
      console.error('Failed to log match on blockchain:', error);
      throw error;
    }
  }

  async getMatchLogs(donorId?: string, recipientId?: string): Promise<any[]> {
    if (!this.contract) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const filter = this.contract.filters.MatchLogged();
      const events = await this.contract.queryFilter(filter);
      
      return events
        .filter(event => {
          if (!donorId && !recipientId) return true;
          const eventLog = event as ethers.EventLog;
          return eventLog.args?.donorId === donorId || eventLog.args?.recipientId === recipientId;
        })
        .map(event => {
          const eventLog = event as ethers.EventLog;
          return {
            hospital: eventLog.args?.hospital,
            donorId: eventLog.args?.donorId,
            recipientId: eventLog.args?.recipientId,
            matchScore: eventLog.args?.matchScore ? Number(eventLog.args.matchScore) / 100 : 0,
            timestamp: eventLog.args?.timestamp ? Number(eventLog.args.timestamp) : 0,
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber
          };
        });
    } catch (error) {
      console.error('Failed to get match logs:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.contract !== null;
  }

  getContractAddress(): string {
    return this.config.contractAddress;
  }
}

// Default blockchain service instance
let blockchainService: BlockchainService | null = null;

export const initializeBlockchainService = async (config: BlockchainConfig): Promise<BlockchainService> => {
  blockchainService = new BlockchainService(config);
  await blockchainService.initialize();
  return blockchainService;
};

export const getBlockchainService = (): BlockchainService | null => {
  return blockchainService;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (params: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}