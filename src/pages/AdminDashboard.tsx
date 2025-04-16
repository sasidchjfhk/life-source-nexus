import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ShieldCheck, 
  User, 
  LogOut,
  Hospital,
  AlertTriangle,
  FileClock,
  Users,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Database,
  Search,
  Pencil,
  Heart,
  UserCog
} from "lucide-react";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import OrganMatchingPanel from "@/components/OrganMatchingPanel";
import MedicalStaffDirectory from "@/components/MedicalStaffDirectory";
import { toast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Simulated admin stats
  const adminStats = {
    totalHospitals: 28,
    pendingVerifications: 7,
    totalUsers: 1284,
    totalTransplants: 142,
    fraudAlerts: 3
  };

  // Simulated hospital verification requests
  const hospitalVerifications = [
    { id: "H-001", name: "City Medical Center", location: "New York, NY", date: "2025-04-10", status: "Pending" },
    { id: "H-002", name: "St. John's Hospital", location: "Chicago, IL", date: "2025-04-12", status: "Under Review" },
    { id: "H-003", name: "Mercy Health Clinic", location: "Los Angeles, CA", date: "2025-04-14", status: "Pending" }
  ];

  // Simulated fraud alerts
  const fraudAlerts = [
    { id: "FR-001", type: "Suspicious Registration", target: "User ID 238", severity: "High", date: "2025-04-15" },
    { id: "FR-002", type: "Duplicate Hospital", target: "Med Center Inc.", severity: "Medium", date: "2025-04-14" },
    { id: "FR-003", type: "Unauthorized Access", target: "IP 192.168.1.45", severity: "High", date: "2025-04-13" }
  ];

  // Generate severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-yellow-500">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };
  
  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    
    toast({
      title: "Admin Login Successful",
      description: `Welcome back, ${userData.name}!`,
    });
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    
    toast({
      title: "Logged Out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Life Source Nexus</h1>
            <Badge className="ml-2 bg-primary">Admin Portal</Badge>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Admin menu</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-72">
                  <DialogHeader>
                    <DialogTitle>Admin Controls</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Access Level</span>
                      <Badge>Full Access</Badge>
                    </div>
                    <div className="space-y-1">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Security Settings
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Button>
                    </div>
                    <Button variant="destructive" size="sm" className="w-full mt-4" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <GoogleLoginButton 
                onSuccess={handleGoogleLogin}
                buttonText="Admin Login"
                size="sm"
              />
            )}
          </div>
        </div>
      </header>

      {isLoggedIn ? (
        /* Main Content - Only visible when logged in */
        <main className="container py-6">
          {/* Admin Dashboard Summary */}
          <div className="grid gap-4 md:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
                </div>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalHospitals}</div>
                <p className="text-xs text-muted-foreground">
                  Registered medical facilities
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                </div>
                <FileClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.pendingVerifications}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting admin approval
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Donors and recipients
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">Transplants</CardTitle>
                </div>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats.totalTransplants}</div>
                <p className="text-xs text-muted-foreground">
                  Completed procedures
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-200 dark:border-red-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Fraud Alerts</CardTitle>
                </div>
                <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{adminStats.fraudAlerts}</div>
                <p className="text-xs text-red-700/70 dark:text-red-400/70">
                  AI-detected warnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="hospitals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="hospitals" className="flex items-center gap-2">
                <Hospital className="h-4 w-4" />
                <span>Hospital Verification</span>
              </TabsTrigger>
              <TabsTrigger value="matching" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Organ Matching</span>
              </TabsTrigger>
              <TabsTrigger value="directory" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span>Medical Directory</span>
              </TabsTrigger>
              <TabsTrigger value="fraud" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Fraud Detection</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="blockchain" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Blockchain Logs</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Hospital Verification Tab */}
            <TabsContent value="hospitals" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Hospital Verification Requests</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search hospitals..." className="pl-8 w-[250px]" />
                </div>
              </div>
              
              <div className="grid gap-4">
                {hospitalVerifications.map((hospital) => (
                  <Card key={hospital.id}>
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{hospital.name}</span>
                          <Badge variant="outline">{hospital.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {hospital.id}</span>
                          <span>•</span>
                          <span>Location: {hospital.location}</span>
                          <span>•</span>
                          <span>Applied: {hospital.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Review Documents
                        </Button>
                        <Button size="sm">Verify</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full gap-1">
                View All Hospitals <ArrowUpRight className="h-4 w-4" />
              </Button>
            </TabsContent>
            
            {/* Organ Matching Tab */}
            <TabsContent value="matching" className="space-y-4">
              <OrganMatchingPanel />
            </TabsContent>
            
            {/* Medical Directory Tab */}
            <TabsContent value="directory" className="space-y-4">
              <MedicalStaffDirectory />
            </TabsContent>
            
            {/* Fraud Detection Tab */}
            <TabsContent value="fraud" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI-Detected Fraud Alerts</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Pencil className="h-4 w-4" />
                  Configure AI Settings
                </Button>
              </div>
              
              <div className="grid gap-4">
                {fraudAlerts.map((alert) => (
                  <Card key={alert.id} className="border-red-200 dark:border-red-900/50">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">{alert.type}</span>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {alert.id}</span>
                          <span>•</span>
                          <span>Target: {alert.target}</span>
                          <span>•</span>
                          <span>Detected: {alert.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                        <Button variant="destructive" size="sm">
                          Flag
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold">System Analytics</h2>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Donor-Recipient Distribution</CardTitle>
                    <CardDescription>Registration statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      <PieChart className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Chart visualization will appear here</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Transactions</CardTitle>
                    <CardDescription>Platform activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Chart visualization will appear here</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Organ Demand vs Supply</CardTitle>
                  <CardDescription>Current platform statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Kidney</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Donated:</span>
                          <span>23</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Needed:</span>
                          <span className="text-red-500">42</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Liver</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Donated:</span>
                          <span>15</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Needed:</span>
                          <span className="text-red-500">28</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Heart</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Donated:</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Needed:</span>
                          <span className="text-red-500">19</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium">Other</h4>
                      <div className="text-sm mt-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Donated:</span>
                          <span>37</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Needed:</span>
                          <span className="text-red-500">61</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Blockchain Logs Tab */}
            <TabsContent value="blockchain" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Blockchain Transaction Logs</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button variant="outline" size="sm">Refresh</Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium">Blockchain Activity Monitor</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                      View and monitor all blockchain transactions related to organ donations, 
                      verification, and transplants in real-time.
                    </p>
                    <Button className="mt-4">Connect to Blockchain</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      ) : (
        /* Login Screen - Only visible when logged out */
        <div className="container py-24 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Admin Portal Login</CardTitle>
              <CardDescription>
                Login with your admin credentials to access the portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-center">
                <GoogleLoginButton 
                  onSuccess={handleGoogleLogin}
                  buttonText="Sign in with Google"
                  variant="default"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              <p>Authorized administrators only</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
