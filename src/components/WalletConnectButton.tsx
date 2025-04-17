
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
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
            title: "Wallet Connected",
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

  if (connected) {
    return (
      <Button
        onClick={disconnectWallet}
        variant={variant}
        size={size}
        className="gap-2"
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
      className="gap-2"
      disabled={isConnecting}
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : buttonText}
    </Button>
  );
};

export default WalletConnectButton;
