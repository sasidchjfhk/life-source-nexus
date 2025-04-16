
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OverviewTab from "@/components/tabs/OverviewTab";
import OrganGalleryTab from "@/components/tabs/OrganGalleryTab";
import HospitalsTab from "@/components/tabs/HospitalsTab";
import MapTab from "@/components/tabs/MapTab";
import AIChatbot from "@/components/AIChatbot";
import QuickNavigation from "@/components/QuickNavigation";

const Index = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Simulate wallet connection
  const connectWallet = async () => {
    try {
      // Simulate MetaMask connection
      setTimeout(() => {
        const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
        setWalletAddress(mockAddress);
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle Google login
  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    toast({
      title: "Login Successful",
      description: "You've been logged in successfully!",
    });
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setWalletConnected(false);
    setWalletAddress("");
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <Header 
        isLoggedIn={isLoggedIn}
        userName={userName}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onLogout={handleLogout}
        onLogin={handleGoogleLogin}
        onWalletConnect={(address) => {
          setWalletConnected(true);
          setWalletAddress(address);
        }}
        onWalletDisconnect={() => {
          setWalletConnected(false);
          setWalletAddress("");
        }}
      />
      
      <main className="flex-1 container py-8">
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="organs">Organ Gallery</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="map">GPS Tracking</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>
          
          {/* Organ Gallery Tab */}
          <TabsContent value="organs" className="mt-6">
            <OrganGalleryTab />
          </TabsContent>
          
          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="mt-6">
            <HospitalsTab />
          </TabsContent>
          
          {/* Map Tab */}
          <TabsContent value="map" className="mt-6">
            <MapTab 
              walletConnected={walletConnected} 
              onConnectWallet={connectWallet} 
            />
          </TabsContent>
        </Tabs>
        
        {/* AI Chatbot Section */}
        <AIChatbot />
        
        {/* Quick Navigation Section */}
        <QuickNavigation />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
