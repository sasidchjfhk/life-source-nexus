
import { useState, useEffect } from "react";
import { supabaseDataService } from "@/services/supabaseDataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import InteractiveMap from "@/components/InteractiveMap";
import SmartNotifications from "@/components/SmartNotifications";
import SecureChatSystem from "@/components/SecureChatSystem";
import { 
  Dna, 
  Heart, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Activity, 
  FileText, 
  User, 
  LogOut, 
  ChevronRight,
  AlertCircle,
  Medal,
  Wallet
} from "lucide-react";

const DonorDashboard = () => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(68);
  
  const [donorProfile, setDonorProfile] = useState({
    name: "Loading...",
    type: "Donor & Recipient",
    bloodType: "O+",
    registeredOrgans: ["Kidney", "Liver"],
    matchScore: 87,
    urgencyLevel: "Medium",
    registrationDate: "March 15, 2025",
    walletConnected: true,
    badgesMinted: 2
  });

  useEffect(() => {
    // Load real donor data
    const loadDonorData = async () => {
      try {
        const donors = await supabaseDataService.getDonors();
        if (donors.length > 0) {
          const latestDonor = donors[donors.length - 1];
          setDonorProfile({
            name: latestDonor.name,
            type: "Donor",
            bloodType: latestDonor.blood_type,
            registeredOrgans: [latestDonor.organ],
            matchScore: 87,
            urgencyLevel: "Medium",
            registrationDate: new Date(latestDonor.created_at).toLocaleDateString(),
            walletConnected: true,
            badgesMinted: (latestDonor as any).approval_status === 'approved' ? 2 : 1
          });
        }
      } catch (error) {
        console.error('Error loading donor data:', error);
      }
    };
    
    loadDonorData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Life Source Nexus</h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden md:flex gap-1">
              <Wallet size={14} /> Connected
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-72">
                <DialogHeader>
                  <DialogTitle>John Doe</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Blood Type</span>
                    <Badge>O+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="secondary">Donor & Recipient</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">NFT Badges</span>
                    <div className="flex">
                      <Medal className="h-4 w-4 text-amber-500" />
                      <Medal className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" className="w-full mt-4">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="realtime">Live Data</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="chat">Secure Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Donor & recipient information</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <FileText className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{donorProfile.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge>{donorProfile.type}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Blood Type</span>
                <Badge variant="outline">{donorProfile.bloodType}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registered Organs</span>
                <div className="flex gap-1">
                  {donorProfile.registeredOrgans.map(organ => (
                    <Badge key={organ} variant="secondary">{organ}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Registration Date</span>
                <span className="text-sm">{donorProfile.registrationDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Blockchain Records</span>
                <Badge variant="outline" className="flex gap-1">
                  <Wallet size={12} /> 
                  {donorProfile.walletConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <div className="pt-2">
                <Button className="w-full">Update Information</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Status Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Organ Match Status</CardTitle>
            <CardDescription>AI-powered matching results</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Match Score</span>
                  <span className="text-sm text-muted-foreground">{donorProfile.matchScore}%</span>
                </div>
                <Progress value={donorProfile.matchScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Medical Compatibility</span>
                  <span className="text-sm text-muted-foreground">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Urgency Level</span>
                  <Badge variant="secondary">{donorProfile.urgencyLevel}</Badge>
                </div>
                <Progress value={55} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <h4 className="text-sm font-semibold">Pending Hospital Verification</h4>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your donor profile is awaiting verification from City Medical Center.
                </p>
              </div>
              
              <div className="rounded-lg border p-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Dna className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold">HLA Typing Status</h4>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Human Leukocyte Antigen testing completed on April 10, 2025.
                </p>
              </div>
              
              <Button className="w-full mt-2">View All Matches</Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle>Organ Tracking</CardTitle>
            <CardDescription>Live status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="relative pl-8">
                <div className="absolute left-0 rounded-full bg-primary p-1.5">
                  <Clock className="h-3 w-3 text-primary-foreground" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm font-medium">Registration Completed</div>
                  <div className="text-xs text-muted-foreground">March 15, 2025, 09:42 AM</div>
                  <p className="text-xs text-muted-foreground">
                    Your donor information has been successfully recorded on the blockchain.
                  </p>
                </div>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 rounded-full bg-primary p-1.5">
                  <Dna className="h-3 w-3 text-primary-foreground" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm font-medium">Medical Testing Completed</div>
                  <div className="text-xs text-muted-foreground">April 10, 2025, 10:15 AM</div>
                  <p className="text-xs text-muted-foreground">
                    HLA typing and tissue matching tests were performed at City Medical Center.
                  </p>
                </div>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 rounded-full bg-border p-1.5">
                  <Activity className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm font-medium">Match Found</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <p className="text-xs text-muted-foreground">
                    Waiting for potential recipient match based on AI recommendation.
                  </p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4 gap-1">
              View Complete Timeline <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* NFT Badge Card */}
        <Card>
          <CardHeader>
            <CardTitle>NFT Badges</CardTitle>
            <CardDescription>Your minted achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg border p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                <Medal className="h-10 w-10 text-amber-500 mb-2" />
                <h3 className="text-sm font-medium">Donor Registration</h3>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Pledged organ donation on the blockchain
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <Medal className="h-10 w-10 text-blue-500 mb-2" />
                <h3 className="text-sm font-medium">Medical Verification</h3>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Completed medical screening process
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View in Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hospital Locations</CardTitle>
            <CardDescription>Find nearby medical facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Map view will appear here</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">City Medical Center</h4>
                <p className="text-xs text-muted-foreground mt-1">2.3 miles away</p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">St. John's Hospital</h4>
                <p className="text-xs text-muted-foreground mt-1">3.7 miles away</p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Metro Health</h4>
                <p className="text-xs text-muted-foreground mt-1">5.1 miles away</p>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
          
          <TabsContent value="realtime">
            <RealTimeDashboard />
          </TabsContent>
          
          <TabsContent value="map">
            <InteractiveMap />
          </TabsContent>
          
          <TabsContent value="notifications">
            <SmartNotifications />
          </TabsContent>
          
          <TabsContent value="chat">
            <SecureChatSystem />
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Chatbot */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full shadow-lg" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 h-[500px]">
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Ask questions about organ donation, matching, or your status.</p>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full shadow-lg" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>AI Assistant</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Ask questions about organ donation, matching, or your status.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DonorDashboard;
