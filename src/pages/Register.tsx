
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Hospital,
  Mail,
  Lock,
  FileText,
  Phone,
  MapPin,
  Wallet,
  AlertCircle,
  Heart,
  Dna,
  Database,
  Shield,
  Globe,
  ArrowRight,
  Users,
  Award
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useWeb3 } from "@/contexts/Web3Context";

const Register = () => {
  const navigate = useNavigate();
  const { connectWallet, walletStatus } = useWeb3();
  const [selectedRole, setSelectedRole] = useState("donor");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: `Registered as ${selectedRole}. Please check your email to verify your account.`,
      });
      
      setIsLoading(false);
      // Redirect to login after registration
      setTimeout(() => navigate("/"), 2000);
    }, 1500);
  };

  const handleDonorContinue = () => {
    navigate('/donor-registration');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3">
            <Heart className="h-10 w-10 text-primary" />
            <Dna className="h-10 w-10 ml-1 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Life Source Nexus</h1>
          <p className="mt-2 text-xl text-muted-foreground">Create Your Account</p>
          <div className="flex justify-center mt-2 space-x-2">
            <div className="flex items-center gap-1 bg-accent/50 text-accent-foreground rounded-full px-3 py-1 text-xs">
              <Database className="h-3 w-3" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-1 bg-accent/50 text-accent-foreground rounded-full px-3 py-1 text-xs">
              <Shield className="h-3 w-3" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Join our blockchain-powered organ donation platform
            </CardDescription>
          </CardHeader>
          
            <Tabs defaultValue="donor" className="w-full" onValueChange={setSelectedRole}>
            <TabsList className="grid grid-cols-3 mb-4 mx-4">
              <TabsTrigger value="donor" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Donor</span>
              </TabsTrigger>
              <TabsTrigger value="hospital" className="flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                <span>Hospital</span>
              </TabsTrigger>
              <TabsTrigger value="doctor" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Doctor</span>
              </TabsTrigger>
            </TabsList>
            
            <CardContent>
              <TabsContent value="donor" className="space-y-4">
                <div className="rounded-lg border p-6 bg-gradient-to-br from-primary/10 to-transparent">
                  <h3 className="text-lg font-semibold mb-2">Become an Organ Donor</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    By registering as an organ donor, you can help save lives. Your information will be securely 
                    stored on the blockchain and you'll receive an NFT badge certifying your donor status.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Secure</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your medical data is encrypted and protected
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Dna className="h-4 w-4 text-blue-500" />
                        <span>AI Matching</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Advanced matching with recipients
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Database className="h-4 w-4 text-purple-500" />
                        <span>Blockchain</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Immutable record of your consent
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Globe className="h-4 w-4 text-amber-500" />
                        <span>Global Impact</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Help recipients worldwide
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={handleDonorContinue}
                  >
                    Continue to Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="doctor" className="space-y-4">
                <div className="rounded-lg border p-6 bg-gradient-to-br from-green-500/10 to-transparent">
                  <h3 className="text-lg font-semibold mb-2">Join as Medical Professional</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Register as a doctor to access our medical network, collaborate with hospitals, 
                    and help facilitate life-saving organ transplants.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Licensed medical professionals only
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>Network</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect with hospitals and colleagues
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Database className="h-4 w-4 text-purple-500" />
                        <span>Records</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Access patient and transplant data
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Award className="h-4 w-4 text-amber-500" />
                        <span>Recognition</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Earn NFT certifications
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => navigate('/doctor-registration')}
                  >
                    Continue to Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="hospital" className="space-y-4">
                <div className="rounded-lg border p-6 bg-gradient-to-br from-blue-500/10 to-transparent">
                  <h3 className="text-lg font-semibold mb-2">Register Your Hospital</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our network of trusted healthcare providers. Get verified and start 
                    connecting with donors and medical professionals worldwide.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Admin-verified healthcare facilities
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Access</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect with organ donors
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Database className="h-4 w-4 text-purple-500" />
                        <span>Platform</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Full platform integration
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium mb-1">
                        <Globe className="h-4 w-4 text-amber-500" />
                        <span>Network</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Global healthcare network
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    onClick={() => navigate('/hospital-registration')}
                  >
                    Continue to Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
                Login instead
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
