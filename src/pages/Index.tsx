
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  Heart, 
  Dna, 
  Hospital, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  LogIn, 
  MapPin, 
  MessageCircle, 
  Wallet,
  Google,
  LogOut
} from "lucide-react";

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

  // Simulate Google login
  const handleGoogleLogin = () => {
    // Simulate a Google login response
    setTimeout(() => {
      setIsLoggedIn(true);
      setUserName("John Doe");
      toast({
        title: "Login Successful",
        description: "You've been logged in successfully!",
      });
    }, 1500);
  };

  // Simulate logout
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
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={handleGoogleLogin} variant="outline" size="sm" className="gap-2">
                <Google className="h-4 w-4" />
                Sign in with Google
              </Button>
            )}
            {walletConnected ? (
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Button>
            ) : (
              <Button onClick={connectWallet} variant="outline" size="sm" className="gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
        <p className="text-center text-xl mt-4 text-muted-foreground">
          Blockchain-powered organ donation platform
        </p>
      </header>
      
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
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Welcome to Life Source Nexus</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform revolutionizes organ donation through blockchain technology, 
                AI matching algorithms, and secure data management.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Link to="/register" className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    <span>Register Now</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/" className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                  <User className="h-16 w-16 text-green-600 dark:text-green-400 opacity-80" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Donor Registration</h3>
                  <p className="text-muted-foreground mb-4">
                    Register as an organ donor and receive an NFT badge certifying your donor status.
                  </p>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link to="/donor-registration" className="flex items-center justify-between">
                      <span>Become a Donor</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <Hospital className="h-16 w-16 text-blue-600 dark:text-blue-400 opacity-80" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Hospital Portal</h3>
                  <p className="text-muted-foreground mb-4">
                    Access our hospital dashboard to manage organ donation requests and matches.
                  </p>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link to="/hospital-dashboard" className="flex items-center justify-between">
                      <span>Hospital Login</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all border-border/50 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                  <ShieldCheck className="h-16 w-16 text-amber-600 dark:text-amber-400 opacity-80" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Admin Portal</h3>
                  <p className="text-muted-foreground mb-4">
                    Administrative tools for hospital verification and fraud detection.
                  </p>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link to="/admin-dashboard" className="flex items-center justify-between">
                      <span>Admin Login</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Organ Gallery Tab */}
          <TabsContent value="organs" className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Organ Donation Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Kidney */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-16 w-16 text-red-600">
                    <path fill="currentColor" d="M12,2C7,2 4,6 4,9C4,13 6,15 8,15C9,15 10,14 10,13C10,12 9,11 8,11C7,11 6,12 6,14C6,15.8 7.2,18 12,18C16.8,18 18,15.8 18,14C18,12 17,11 16,11C15,11 14,12 14,13C14,14 15,15 16,15C18,15 20,13 20,9C20,6 17,2 12,2Z" />
                  </svg>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Kidney</h3>
                  <p className="text-sm text-muted-foreground">Most common transplant</p>
                </CardContent>
              </Card>
              
              {/* Liver */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-16 w-16 text-amber-600">
                    <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Liver</h3>
                  <p className="text-sm text-muted-foreground">Second most needed organ</p>
                </CardContent>
              </Card>
              
              {/* Heart */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-rose-600" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Heart</h3>
                  <p className="text-sm text-muted-foreground">Life-saving transplant</p>
                </CardContent>
              </Card>
              
              {/* Lungs */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-16 w-16 text-blue-600">
                    <path fill="currentColor" d="M15.5,15.38V8.62L18.88,5.24C19.5,6.33 20,7.5 20,9C20,11.53 18.39,14.19 15.5,15.38M14.5,11.88C14.5,10.5 13.5,8.5 12.5,8.5C11.5,8.5 10.5,10.5 10.5,11.88C10.5,13.25 11.5,15.25 12.5,15.25C13.5,15.25 14.5,13.25 14.5,11.88M8.5,15.38C5.61,14.19 4,11.53 4,9C4,7.5 4.5,6.33 5.12,5.24L8.5,8.62V15.38M21.25,4.25C22.5,6 23,7.5 23,9C23,13 19.5,16.5 15.5,17.5V20H13V16.88C12.84,16.91 12.67,16.94 12.5,16.94C12.33,16.94 12.16,16.91 12,16.88V20H9.5V17.5C5.5,16.5 2,13 2,9C2,7.5 2.5,6 3.75,4.25L7.62,8.12V15C8,16 9,18 10,18C10.47,18 12,16.8 12.5,15.75C13,16.8 14.53,18 15,18C16,18 17,16 17.38,15V8.12L21.25,4.25Z" />
                  </svg>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Lungs</h3>
                  <p className="text-sm text-muted-foreground">Essential respiratory organ</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Partner Hospitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Hospital 1 */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <Hospital className="h-16 w-16 text-blue-600" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">City Medical Center</h3>
                  <p className="text-sm text-muted-foreground mb-2">World-class transplant facility</p>
                  <div className="flex justify-between text-sm">
                    <span>New York, NY</span>
                    <span className="text-green-600">Verified</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Hospital 2 */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <Hospital className="h-16 w-16 text-blue-600" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">St. John's Hospital</h3>
                  <p className="text-sm text-muted-foreground mb-2">Specialized in kidney transplants</p>
                  <div className="flex justify-between text-sm">
                    <span>Chicago, IL</span>
                    <span className="text-green-600">Verified</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Hospital 3 */}
              <Card className="hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <Hospital className="h-16 w-16 text-blue-600" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Mercy Health Clinic</h3>
                  <p className="text-sm text-muted-foreground mb-2">Leading heart transplant center</p>
                  <div className="flex justify-between text-sm">
                    <span>Los Angeles, CA</span>
                    <span className="text-green-600">Verified</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Map Tab */}
          <TabsContent value="map" className="mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Organ Tracking Map</h2>
            <Card className="mb-8">
              <CardContent className="p-0 overflow-hidden">
                <div className="aspect-[16/9] relative">
                  <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center max-w-md p-4">
                      Connect your wallet to view the organ tracking map with real-time GPS updates.
                      Live tracking helps ensure organ transportation security and transparency.
                    </p>
                    <Button onClick={connectWallet} disabled={walletConnected} className="mt-2">
                      <Wallet className="h-4 w-4 mr-2" />
                      {walletConnected ? "Wallet Connected" : "Connect Wallet to View Map"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* AI Chatbot Section */}
        <div className="bg-secondary/10 rounded-lg p-6 border border-border/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">AI Assistant</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Have questions about organ donation, transplant process, or our platform? Our AI assistant can help answer your questions.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/donor-dashboard" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Open Chat Assistant</span>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/donor-registration" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                <span>Start Registration</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Navigation Section */}
        <div className="bg-secondary/10 rounded-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-4 text-center">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild variant="outline" size="sm">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/register">Register</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/donor-registration">Donor Registration</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/donor-dashboard">Donor Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/hospital-dashboard">Hospital Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                &copy; 2025 Life Source Nexus. All rights reserved.
              </span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Privacy Policy</Button>
              <Button variant="ghost" size="sm">Terms of Service</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
