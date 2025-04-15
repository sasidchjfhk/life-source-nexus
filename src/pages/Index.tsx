
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Hospital, 
  Building2, 
  ShieldCheck,
  Mail, 
  Lock, 
  Github, 
  Wallet
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("donor");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login - in a real app, this would connect to Firebase or Web3
    toast({
      title: "Login Successful",
      description: `Logged in as ${selectedRole}`,
    });

    // Redirect based on role
    if (selectedRole === "donor") {
      navigate("/donor-dashboard");
    } else if (selectedRole === "hospital") {
      navigate("/hospital-dashboard");
    } else if (selectedRole === "admin") {
      navigate("/admin-dashboard");
    }
  };

  const handleWalletConnect = () => {
    // Simulate Web3 wallet connection
    toast({
      title: "Wallet Connected",
      description: "MetaMask wallet connected successfully",
    });
    
    setTimeout(() => navigate("/donor-dashboard"), 1500);
  };

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    toast({
      title: "Google Authentication",
      description: "Logging in with Google...",
    });
    
    setTimeout(() => navigate("/donor-dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Life Source Nexus</h1>
          <p className="mt-2 text-xl text-muted-foreground">Blockchain-powered organ donation platform</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Select your role to continue
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="donor" className="w-full" onValueChange={setSelectedRole}>
            <TabsList className="grid grid-cols-3 mb-4 mx-4">
              <TabsTrigger value="donor" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Donor/Recipient</span>
                <span className="sm:hidden">Donor</span>
              </TabsTrigger>
              <TabsTrigger value="hospital" className="flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                <span>Hospital</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <CardContent>
              <TabsContent value="donor" className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleWalletConnect}
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                  
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">or</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="donor-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="donor-email" 
                            type="email" 
                            placeholder="name@example.com" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donor-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="donor-password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">Login</Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              <TabsContent value="hospital" className="space-y-4">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital-email">Hospital Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="hospital-email" 
                          type="email" 
                          placeholder="hospital@example.com" 
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="hospital-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Hospital Verification Required</span>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="admin-email" 
                          type="email" 
                          placeholder="admin@lifesourcenexus.com" 
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="admin-password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Secure Admin Access</span>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </div>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                Register now
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          <p>&copy; 2025 Life Source Nexus. All rights reserved.</p>
          <p className="mt-1">Powered by blockchain technology</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
