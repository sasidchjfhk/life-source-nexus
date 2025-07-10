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
import BlockchainStatus from "@/components/BlockchainStatus";
import { useAuth } from "@/App";
import { useWallet } from "@/App";
import { useNavigate } from "react-router-dom";
import OrganMatchingAI from "@/components/OrganMatchingAI";
import { supabaseDataService } from "@/services/supabaseDataService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Activity, Award, Sparkles } from "lucide-react";

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
  
  // State for image slider and statistics
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalPatients: 0,
    totalMatches: 0,
    successfulTransplants: 0,
    activeMatches: 0,
    criticalPatients: 0,
    verifiedHospitals: 0,
    organTypes: {} as Record<string, number>
  });

  // Load statistics on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [donors, recipients, matches] = await Promise.all([
          supabaseDataService.getDonors(),
          supabaseDataService.getRecipients(),
          supabaseDataService.getMatches()
        ]);
        
        setStats({
          totalDonors: donors.length,
          totalPatients: recipients.length,
          totalMatches: matches.length,
          successfulTransplants: matches.filter(m => m.status === 'completed').length,
          activeMatches: matches.filter(m => m.status === 'pending').length,
          criticalPatients: recipients.filter(r => r.urgency_level && r.urgency_level >= 8).length,
          verifiedHospitals: 0, // Could be updated when hospital system is implemented
          organTypes: donors.reduce((acc, donor) => {
            acc[donor.organ] = (acc[donor.organ] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        });
      } catch (error) {
        console.error('Error loading statistics:', error);
        // Fallback to empty stats but keep trying
        setStats({
          totalDonors: 0,
          totalPatients: 0,
          totalMatches: 0,
          successfulTransplants: 0,
          activeMatches: 0,
          criticalPatients: 0,
          verifiedHospitals: 0,
          organTypes: {}
        });
      }
    };
    
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
            navigate("/admin");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="relative z-10">
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
        
        {/* Enhanced Hero Banner */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/30 flex items-center">
                      <div className="container">
                        <div className="max-w-2xl">
                          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            Revolutionizing Organ Donation
                          </h1>
                          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                            Secure, transparent, and efficient organ donation management powered by AI and blockchain technology.
                          </p>
                          
                          {/* Live Statistics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
                              <CardContent className="p-4 text-center">
                                <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-red-500">{stats.totalDonors}</div>
                                <div className="text-xs text-muted-foreground">Donors</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
                              <CardContent className="p-4 text-center">
                                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-500">{stats.totalPatients}</div>
                                <div className="text-xs text-muted-foreground">Patients</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
                              <CardContent className="p-4 text-center">
                                <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-500">{stats.activeMatches}</div>
                                <div className="text-xs text-muted-foreground">Active Matches</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
                              <CardContent className="p-4 text-center">
                                <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-purple-500">{stats.successfulTransplants}</div>
                                <div className="text-xs text-muted-foreground">Successful</div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Enhanced Features */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI-Powered Matching
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                              Blockchain Secured
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                              NFT Certification
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">
                              Real-time Tracking
                            </Badge>
                          </div>
                        </div>
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
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              AI-Powered Organ Matching
            </h2>
            <OrganMatchingAI />
          </div>
          
          {/* Blockchain Integration Section */}
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Blockchain Integration
            </h2>
            <BlockchainStatus />
          </div>
          
          {/* AI Chatbot Section */}
          <AIChatbot />
          
          {/* Quick Navigation Section */}
          <QuickNavigation />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
