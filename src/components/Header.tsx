
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Dna, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import WalletConnectButton from "@/components/WalletConnectButton";

interface HeaderProps {
  isLoggedIn: boolean;
  userName: string;
  walletConnected: boolean;
  walletAddress: string;
  onLogout: () => void;
  onLogin: (userData: { name: string; email: string }) => void;
  onWalletConnect: (address: string) => void;
  onWalletDisconnect: () => void;
  userType?: "donor" | "hospital" | "admin";
}

const Header = ({
  isLoggedIn,
  userName,
  walletConnected,
  walletAddress,
  onLogout,
  onLogin,
  onWalletConnect,
  onWalletDisconnect,
  userType = "donor"
}: HeaderProps) => {
  return (
    <header className="container py-6 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <Dna className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-primary">Life Source Nexus</h1>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{userName}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <GoogleLoginButton 
              onSuccess={onLogin}
              variant="outline" 
              size="sm"
              userType={userType}
            />
          )}
          {walletConnected ? (
            <Button variant="outline" size="sm">
              <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </Button>
          ) : (
            <WalletConnectButton
              onConnect={onWalletConnect}
              onDisconnect={onWalletDisconnect}
              variant="outline"
              size="sm"
            />
          )}
        </div>
      </div>
      <p className="text-center text-xl mt-4 text-muted-foreground">
        Blockchain-powered organ donation platform
      </p>
    </header>
  );
};

export default Header;
