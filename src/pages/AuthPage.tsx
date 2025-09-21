import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/App";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import WalletConnectButton from "@/components/WalletConnectButton";
import { 
  Heart, 
  Hospital, 
  Shield, 
  Users,
  Stethoscope,
  UserCheck,
  Activity
} from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"donor" | "hospital" | "admin" | "recipient">("donor");

  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    login(userData.name, selectedRole);
    
    // Navigate based on role
    switch(selectedRole) {
      case "donor":
        navigate("/donor-dashboard");
        break;
      case "recipient":
        navigate("/recipient-dashboard");
        break;
      case "hospital":
        navigate("/hospital-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  const handleWalletConnect = (address: string) => {
    toast({
      title: "Wallet Connected",
      description: `Connected with address: ${address.slice(0, 8)}...`,
    });
  };

  const roleCards = [
    {
      role: "donor" as const,
      title: "Organ Donor",
      description: "Register as an organ donor and help save lives",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      features: ["Register organs for donation", "NFT certification", "Real-time matching"]
    },
    {
      role: "recipient" as const,
      title: "Recipient",
      description: "Find compatible organ donors for transplantation",
      icon: UserCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      features: ["Find compatible donors", "Track match progress", "Medical coordination"]
    },
    {
      role: "hospital" as const,
      title: "Healthcare Provider",
      description: "Manage patients and coordinate transplant procedures",
      icon: Hospital,
      color: "text-green-500",
      bgColor: "bg-green-50",
      features: ["Patient management", "Transplant coordination", "Medical verification"]
    },
    {
      role: "admin" as const,
      title: "System Administrator",
      description: "Oversee platform operations and approvals",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      features: ["User approvals", "System monitoring", "Platform oversight"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Life Source Nexus Authentication
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Secure blockchain-powered organ donation platform
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Choose your role and login with Google or MetaMask</span>
          </div>
        </div>

        <Tabs defaultValue="role-selection" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="role-selection">1. Select Role</TabsTrigger>
            <TabsTrigger value="authentication">2. Authenticate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="role-selection" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
              <p className="text-muted-foreground">Choose how you'll be using the Life Source Nexus platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleCards.map((roleCard) => {
                const Icon = roleCard.icon;
                const isSelected = selectedRole === roleCard.role;
                
                return (
                  <Card 
                    key={roleCard.role}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => setSelectedRole(roleCard.role)}
                  >
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full ${roleCard.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`h-8 w-8 ${roleCard.color}`} />
                      </div>
                      <CardTitle className="text-lg">{roleCard.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {roleCard.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {roleCard.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      {isSelected && (
                        <Badge className="w-full justify-center mt-4">
                          Selected
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => {
                  const tabTrigger = document.querySelector('[value="authentication"]') as HTMLElement;
                  tabTrigger?.click();
                }}
              >
                Continue as {roleCards.find(r => r.role === selectedRole)?.title}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="authentication" className="space-y-6">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {(() => {
                      const roleCard = roleCards.find(r => r.role === selectedRole);
                      const Icon = roleCard?.icon || Heart;
                      return <Icon className={`h-8 w-8 ${roleCard?.color || 'text-primary'}`} />;
                    })()}
                  </div>
                  <CardTitle>
                    Login as {roleCards.find(r => r.role === selectedRole)?.title}
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred authentication method
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GoogleLoginButton
                    onSuccess={handleGoogleLogin}
                    buttonText="Continue with Google"
                    variant="outline"
                    size="lg"
                    userType={selectedRole}
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <WalletConnectButton
                      onConnect={handleWalletConnect}
                      variant="outline"
                      size="lg"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground pt-4">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Shield className="h-4 w-4" />
                      <span>Your data is secured with blockchain technology</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    const tabTrigger = document.querySelector('[value="role-selection"]') as HTMLElement;
                    tabTrigger?.click();
                  }}
                >
                  ← Back to Role Selection
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;