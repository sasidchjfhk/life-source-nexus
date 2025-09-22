import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Hospital, 
  User, 
  LogOut,
  Clipboard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck,
  UserCog,
  FileText,
  Calendar,
  ChevronRight,
  Search,
  Microscope,
  Heart,
  Stethoscope,
  Users,
  Activity,
  DollarSign,
  FlaskConical,
  Pill,
  Building,
  TrendingUp,
  AlertTriangle,
  Phone,
  Shield,
  MapPin
} from "lucide-react";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import OrganMatchingPanel from "@/components/OrganMatchingPanel";
import MedicalStaffDirectory from "@/components/MedicalStaffDirectory";
import PatientManagement from "@/components/hospital/PatientManagement";
import EquipmentManagement from "@/components/hospital/EquipmentManagement";
import StaffManagement from "@/components/hospital/StaffManagement";
import { toast } from "@/components/ui/use-toast";

const HospitalDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("verification");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Simulated hospital data
  const hospitalData = {
    name: "City Medical Center",
    id: "CMC-12345",
    verificationStatus: "Verified",
    pendingVerifications: 5,
    approvedTransplants: 24,
    waitingRecipients: 12,
    registeredDoctors: 8,
    totalPatients: 147,
    emergencyAlerts: 3,
    equipment: 89,
    revenue: 2400000,
    occupancyRate: 85,
    avgWaitTime: 15,
    labResults: 234,
    pharmacyOrders: 156
  };

  // Simulated pending verifications
  const pendingVerifications = [
    { id: "REQ-001", name: "Alice Johnson", type: "Donor", organ: "Kidney", urgency: "Low", date: "2025-04-13" },
    { id: "REQ-002", name: "Robert Smith", type: "Recipient", organ: "Liver", urgency: "High", date: "2025-04-14" },
    { id: "REQ-003", name: "Sarah Williams", type: "Donor", organ: "Kidney", urgency: "Medium", date: "2025-04-15" },
    { id: "REQ-004", name: "Michael Brown", type: "Recipient", organ: "Heart", urgency: "Critical", date: "2025-04-15" },
    { id: "REQ-005", name: "Emily Davis", type: "Donor", organ: "Bone Marrow", urgency: "Low", date: "2025-04-16" }
  ];

  // Simulated upcoming transplants
  const upcomingTransplants = [
    { id: "TR-001", donor: "Thomas Wilson", recipient: "Julia Martinez", organ: "Kidney", date: "2025-04-17", status: "Scheduled" },
    { id: "TR-002", donor: "Daniel Lee", recipient: "Lisa Thompson", organ: "Liver", date: "2025-04-20", status: "Preparing" },
    { id: "TR-003", donor: "Anonymous", recipient: "Carlos Rodriguez", organ: "Heart", date: "2025-04-25", status: "Waiting for Organ" }
  ];

  // Generate urgency badge
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge className="bg-orange-500">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "Low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };
  
  const handleGoogleLogin = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    
    toast({
      title: "Hospital Login Successful",
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
            <Hospital className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Life Source Nexus</h1>
            <Badge variant="outline" className="ml-2">Hospital Portal</Badge>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-72">
                  <DialogHeader>
                    <DialogTitle>{isLoggedIn ? userName : hospitalData.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Hospital ID</span>
                      <span className="text-sm">{hospitalData.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        {hospitalData.verificationStatus}
                      </Badge>
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
                buttonText="Hospital Login"
                size="sm"
              />
            )}
          </div>
        </div>
      </header>

      {isLoggedIn ? (
        /* Main Content - Only visible when logged in */
        <main className="container py-6">
          {/* Hospital Dashboard Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Patients</CardTitle>
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{hospitalData.totalPatients}</div>
                <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Occupancy Rate</CardTitle>
                <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800 dark:text-green-200">{hospitalData.occupancyRate}%</div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${hospitalData.occupancyRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Emergency Alerts</CardTitle>
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">{hospitalData.emergencyAlerts}</div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Active alerts requiring attention
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Equipment Status</CardTitle>
                <Stethoscope className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800 dark:text-purple-200">{hospitalData.equipment}</div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Active medical equipment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Transplants Completed</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{hospitalData.approvedTransplants}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{hospitalData.avgWaitTime}m</div>
                <p className="text-xs text-muted-foreground">Emergency dept.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
                <FlaskConical className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{hospitalData.labResults}</div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pharmacy Orders</CardTitle>
                <Pill className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{hospitalData.pharmacyOrders}</div>
                <p className="text-xs text-muted-foreground">Active orders</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="patients" className="space-y-4" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8">
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Patients</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Equipment</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Verification</span>
              </TabsTrigger>
              <TabsTrigger value="transplants" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Transplants</span>
              </TabsTrigger>
              <TabsTrigger value="matching" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Matching</span>
              </TabsTrigger>
              <TabsTrigger value="directory" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Directory</span>
              </TabsTrigger>
              <TabsTrigger value="registry" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Registry</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Patient Management Tab */}
            <TabsContent value="patients" className="space-y-4">
              <PatientManagement />
            </TabsContent>

            {/* Staff Management Tab */}
            <TabsContent value="staff" className="space-y-4">
              <StaffManagement />
            </TabsContent>

            {/* Equipment Management Tab */}
            <TabsContent value="equipment" className="space-y-4">
              <EquipmentManagement />
            </TabsContent>

            {/* Verification Requests Tab */}
            <TabsContent value="verification" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pending Verification Requests</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search requests..." className="pl-8 w-[250px]" />
                </div>
              </div>
              
              <div className="grid gap-4">
                {pendingVerifications.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{request.name}</span>
                          <Badge variant="outline">{request.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {request.id}</span>
                          <span>•</span>
                          <span>Organ: {request.organ}</span>
                          <span>•</span>
                          <span>Date: {request.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>{getUrgencyBadge(request.urgency)}</div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Microscope className="h-4 w-4" />
                          Verify
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full gap-1">
                View All Requests <ChevronRight className="h-4 w-4" />
              </Button>
            </TabsContent>
            
            {/* Upcoming Transplants Tab */}
            <TabsContent value="transplants" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upcoming Transplant Surgeries</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  Calendar View
                </Button>
              </div>
              
              <div className="grid gap-4">
                {upcomingTransplants.map((transplant) => (
                  <Card key={transplant.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{transplant.organ} Transplant</span>
                            <Badge variant={transplant.status === "Scheduled" ? "outline" : "secondary"}>
                              {transplant.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>ID: {transplant.id}</span>
                            <span> • </span>
                            <span>Date: {transplant.date}</span>
                          </div>
                        </div>
                        <Button size="sm">Update Status</Button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Donor Information</h4>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span>{transplant.donor}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Blockchain Verification:</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                Verified
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recipient Information</h4>
                          <div className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span>{transplant.recipient}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Match Score:</span>
                              <span>94%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Organ Matching Tab */}
            <TabsContent value="matching" className="space-y-4">
              <OrganMatchingPanel />
            </TabsContent>
            
            {/* Medical Directory Tab */}
            <TabsContent value="directory" className="space-y-4">
              <MedicalStaffDirectory />
            </TabsContent>
            
            {/* Organ Registry Tab */}
            <TabsContent value="registry" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Blockchain Organ Registry</h2>
                <Button size="sm">Add New Entry</Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium">Organ Registry Data Will Appear Here</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                      View and manage organ registry data securely stored on the blockchain.
                      All transactions are immutable and transparent.
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
              <Hospital className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Hospital Portal Login</CardTitle>
              <CardDescription>
                Login with your hospital credentials to access the portal
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
            <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
              <p>Authorized hospital personnel only</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
