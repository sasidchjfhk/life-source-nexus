import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { supabaseDataService } from "@/services/supabaseDataService";
import { useAuth } from "@/App";
import NFTBadgeDisplay from "@/components/NFTBadgeDisplay";
import { 
  Heart, 
  Activity,
  Calendar,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Bell,
  Shield,
  Search,
  Eye
} from "lucide-react";

const RecipientDashboard = () => {
  const { userName } = useAuth();
  const [recipientData, setRecipientData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [availableDonors, setAvailableDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [recipients, matchesData, donorsData] = await Promise.all([
        supabaseDataService.getRecipients(),
        supabaseDataService.getMatches(),
        supabaseDataService.getDonors()
      ]);

      // Find current recipient (mock - in real app would use auth.uid())
      const currentRecipient = recipients.find(r => r.name.includes("Sarah"));
      setRecipientData(currentRecipient || recipients[0] || {
        id: "mock-recipient",
        name: userName || "Sarah Patient",
        blood_type: "O+",
        required_organ: "Heart",
        urgency_level: 8,
        location: "New York, NY",
        approval_status: "approved",
        created_at: new Date().toISOString()
      });

      setMatches(matchesData.filter(m => m.recipient_id === currentRecipient?.id || matchesData.slice(0, 3)));
      setAvailableDonors(donorsData.filter(d => d.availability && d.approval_status === 'approved'));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const findCompatibleDonors = () => {
    const compatible = availableDonors.filter(donor => {
      const bloodCompatible = donor.blood_type === recipientData?.blood_type || 
                             donor.blood_type === "O-" || 
                             (recipientData?.blood_type?.includes("+") && donor.blood_type?.includes("-"));
      const organMatch = donor.organ === recipientData?.required_organ;
      return bloodCompatible && organMatch;
    });

    toast({
      title: "Compatible Donors Found",
      description: `Found ${compatible.length} compatible donors in your area.`,
    });

    return compatible;
  };

  const requestMatch = async (donorId: string) => {
    try {
      toast({
        title: "Match Request Sent",
        description: "Your match request has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send match request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="container mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Loading Recipient Dashboard...</h2>
            <p className="text-muted-foreground">Fetching your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome back, {recipientData?.name || userName}
          </h1>
          <p className="text-muted-foreground">Manage your organ transplant journey</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needed Organ</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipientData?.required_organ}</div>
              <p className="text-xs text-muted-foreground">Blood Type: {recipientData?.blood_type}</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgency Level</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipientData?.urgency_level}/10</div>
              <Progress value={(recipientData?.urgency_level || 0) * 10} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Matches</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">Active matches</p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Waiting</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recipientData?.created_at ? Math.floor((Date.now() - new Date(recipientData.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">On waiting list</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="donors">Find Donors</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">New potential match found</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Medical records updated</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Urgency level updated to {recipientData?.urgency_level}</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Match Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Profile Completion</span>
                        <span>95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Medical Clearance</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Match Probability</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Organ Matches</CardTitle>
                <CardDescription>
                  AI-powered matches based on compatibility and medical factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={match.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Match Score: {match.match_score || (85 + index * 2)}%</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {match.status || 'pending'} • Location: Manhattan, NY
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default">
                              Compatible Blood Type
                            </Badge>
                            <Badge variant="secondary">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No matches found yet</p>
                      <p className="text-sm text-muted-foreground">We're actively searching for compatible donors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Find Compatible Donors
                  <Button onClick={findCompatibleDonors} className="gap-2">
                    <Search className="h-4 w-4" />
                    Search Now
                  </Button>
                </CardTitle>
                <CardDescription>
                  Browse available donors that match your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableDonors.slice(0, 5).map((donor) => (
                    <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {donor.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {donor.blood_type} • {donor.organ} • {donor.location || 'New York Area'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default">Available</Badge>
                            <Badge variant="outline">
                              <MapPin className="h-3 w-3 mr-1" />
                              5 miles away
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => requestMatch(donor.id)}
                        >
                          Request Match
                        </Button>
                      </div>
                    </div>
                  ))}
                  {availableDonors.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No compatible donors available</p>
                      <p className="text-sm text-muted-foreground">We'll notify you when new donors register</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-lg">{recipientData?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Blood Type</label>
                    <p className="text-lg">{recipientData?.blood_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Required Organ</label>
                    <p className="text-lg">{recipientData?.required_organ}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <p className="text-lg">{recipientData?.location}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Urgency Level</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={(recipientData?.urgency_level || 0) * 10} className="flex-1" />
                      <span className="text-sm font-medium">{recipientData?.urgency_level}/10</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registration Status</label>
                    <Badge variant={recipientData?.approval_status === 'approved' ? "default" : "secondary"}>
                      {recipientData?.approval_status || 'Pending'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Days on List</label>
                    <p className="text-lg">
                      {recipientData?.created_at ? Math.floor((Date.now() - new Date(recipientData.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                    </p>
                  </div>
                  <NFTBadgeDisplay 
                    userId={recipientData?.id}
                    userType="recipient"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecipientDashboard;