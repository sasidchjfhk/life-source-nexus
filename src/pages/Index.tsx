
import { useState, useEffect } from "react";
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
import { useAuth } from "@/App";
import { useWallet } from "@/App";
import { useNavigate } from "react-router-dom";
import OrganMatchingAI from "@/components/OrganMatchingAI";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const featuredImages = [
  "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1579154204871-29d7e79ed5a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1631549916768-4119b4220ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1582560474992-385ebb9b0213?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
];

const Index = () => {
  const { isConnected, address, connect, disconnect } = useWallet();
  const { isLoggedIn, userName, login, logout, userRole } = useAuth();
  const navigate = useNavigate();
  
  // State for image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle wallet connection
  const connectWallet = (address: string) => {
    connect(address);
    toast({
      title: "Wallet Connected",
      description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
    });
  };

  // Handle Google login
  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    if (userData && userData.name) {
      // Determine user role based on email domain
      let role: "donor" | "hospital" | "admin" = "donor";
      
      if (userData.email.includes("hospital") || userData.email.includes("medical")) {
        role = "hospital";
      } else if (userData.email.includes("admin")) {
        role = "admin";
      }
      
      login(userData.name, role);
      
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        switch (role) {
          case "donor":
            navigate("/donor-dashboard");
            break;
          case "hospital":
            navigate("/hospital-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
        }
      }, 1000);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    disconnect();
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully.",
    });
  };

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === featuredImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <Header 
        isLoggedIn={isLoggedIn}
        userName={userName}
        walletConnected={isConnected}
        walletAddress={address}
        onLogout={handleLogout}
        onLogin={handleGoogleLogin}
        onWalletConnect={connectWallet}
        onWalletDisconnect={disconnect}
        userType={userRole || "donor"}
      />
      
      {/* Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent>
            {featuredImages.map((image, index) => (
              <CarouselItem key={index} className="w-full h-full">
                <div className="relative w-full h-full">
                  <img 
                    src={image} 
                    alt={`Medical innovation ${index+1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20 flex items-center">
                    <div className="container">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-md">
                        Revolutionizing Organ Donation with Blockchain
                      </h1>
                      <p className="text-lg max-w-md">
                        Secure, transparent, and efficient organ donation management powered by AI.
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
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
              walletConnected={isConnected} 
              onConnectWallet={() => {
                if (!isConnected) {
                  // Generate a mock wallet address
                  const mockAddress = "0x" + Math.random().toString(16).substr(2, 40);
                  connectWallet(mockAddress);
                }
              }} 
            />
          </TabsContent>
        </Tabs>
        
        {/* AI Organ Matching Section */}
        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">AI-Powered Organ Matching</h2>
          <OrganMatchingAI />
        </div>
        
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
