
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  buttonText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const WalletConnectButton = ({
  onConnect,
  onDisconnect,
  buttonText = "Connect Wallet",
  variant = "outline",
  size = "default"
}: WalletConnectButtonProps) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed on component mount
  useEffect(() => {
    const checkMetaMask = () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true);
      }
    };
    
    checkMetaMask();
  }, []);

  const connectWallet = async () => {
    try {
      // Prevent multiple clicks
      if (isConnecting) return;
      
      setIsConnecting(true);
      
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        toast({
          title: "Connecting to MetaMask",
          description: "Please approve the connection request in MetaMask...",
        });
        
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          
          setAddress(account);
          setConnected(true);
          
          if (onConnect) {
            onConnect(account);
          }
          
          toast({
            title: "MetaMask Connected",
            description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`,
          });
        } catch (error) {
          // User denied account access
          toast({
            title: "Connection Rejected",
            description: "You rejected the connection request.",
            variant: "destructive",
          });
        }
      } else {
        // MetaMask not installed, fall back to mock connection
        toast({
          title: "MetaMask Not Detected",
          description: "Using mock wallet connection instead...",
        });
        
        setTimeout(() => {
          const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
          setAddress(mockAddress);
          setConnected(true);
          
          if (onConnect) {
            onConnect(mockAddress);
          }
          
          toast({
            title: "Mock Wallet Connected",
            description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress("");
    
    if (onDisconnect) {
      onDisconnect();
    }
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  // MetaMask logo SVG
  const MetaMaskLogo = () => (
    <svg width="16" height="16" viewBox="0 0 122.88 111.34" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
      <path d="M113.12,0.23l-30.7,22.93L91.76,10.4L113.12,0.23L113.12,0.23z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.7,0.23l30.42,23.16l-9.79-12.99L9.7,0.23L9.7,0.23z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M96.76,79.92L84.63,98.29l44.46,12.25l12.75-42.99L96.76,79.92L96.76,79.92z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0.97,67.55l12.67,42.99l44.46-12.25L46,79.92L0.97,67.55L0.97,67.55z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.16" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.32,35.22L8.27,67.11h35.95L74.39,67.11h36.21l-9.12-31.89l-84.15,0Z" fill="#E8821E"/>
      <path d="M56.56,79.92l-12.11,18.37l43.19,0l-12.11-18.37l-18.97,0Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (connected) {
    return (
      <Button
        onClick={disconnectWallet}
        variant={variant}
        size={size}
        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
      >
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      variant={variant}
      size={size}
      className="gap-1 relative bg-orange-500 hover:bg-orange-600 text-white font-medium"
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Connecting...
        </>
      ) : (
        <>
          {isMetaMaskInstalled ? <MetaMaskLogo /> : <Wallet className="h-4 w-4 mr-2" />}
          {buttonText}
        </>
      )}
    </Button>
  );
};

export default WalletConnectButton;
