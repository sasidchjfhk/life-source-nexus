
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
  AlertCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("donor");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Registration Successful",
      description: `Registered as ${selectedRole}. Please check your email to verify your account.`,
    });
    
    // Redirect to login after registration
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Life Source Nexus</h1>
          <p className="mt-2 text-xl text-muted-foreground">Create Your Account</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Join our blockchain-powered organ donation platform
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="donor" className="w-full" onValueChange={setSelectedRole}>
            <TabsList className="grid grid-cols-2 mb-4 mx-4">
              <TabsTrigger value="donor" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Donor/Recipient</span>
              </TabsTrigger>
              <TabsTrigger value="hospital" className="flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                <span>Hospital</span>
              </TabsTrigger>
            </TabsList>
            
            <CardContent>
              <TabsContent value="donor" className="space-y-4">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Doe" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="donor-email" type="email" placeholder="name@example.com" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="donor-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="donor-password" type="password" placeholder="••••••••" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="donor-type">I am registering as</Label>
                      <Select defaultValue="both">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="donor">Organ Donor</SelectItem>
                          <SelectItem value="recipient">Organ Recipient</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood-type">Blood Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          terms and conditions
                        </Link>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wallet" />
                      <Label htmlFor="wallet" className="text-sm flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        I have a Web3 wallet (optional)
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full">Create Account</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="hospital" className="space-y-4">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hospital-name">Hospital Name</Label>
                      <Input id="hospital-name" placeholder="City Medical Center" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital-email">Official Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="hospital-email" type="email" placeholder="hospital@example.com" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="hospital-password" type="password" placeholder="••••••••" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital-license">License Number</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="hospital-license" placeholder="License ID" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital-phone">Contact Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="hospital-phone" type="tel" placeholder="+1 (555) 123-4567" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hospital-address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="hospital-address" placeholder="123 Medical Ave, City" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <p className="text-xs text-muted-foreground">Hospital registrations require verification. You'll receive instructions via email.</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hospital-terms" required />
                      <Label htmlFor="hospital-terms" className="text-sm">
                        I certify that I am authorized to register this healthcare facility
                      </Label>
                    </div>
                    
                    <Button type="submit" className="w-full">Submit Application</Button>
                  </div>
                </form>
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
