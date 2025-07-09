import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabaseDataService } from "@/services/supabaseDataService";
import { DonorProfile, HospitalProfile, DoctorProfile } from "@/models/userData";
import AdminApprovalPanel from "@/components/AdminApprovalPanel";
import { 
  Users, 
  Hospital, 
  Heart, 
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Award,
  TrendingUp
} from "lucide-react";

const AdminDashboard = () => {
  const [donors, setDonors] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalPatients: 0,
    totalHospitals: 0,
    totalDoctors: 0,
    totalMatches: 0,
    successfulTransplants: 0
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [donorsData, recipientsData, hospitalsData, doctorsData, matchesData] = await Promise.all([
        supabaseDataService.getDonors(),
        supabaseDataService.getRecipients(),
        supabaseDataService.getHospitals(),
        supabaseDataService.getDoctors(),
        supabaseDataService.getMatches()
      ]);

      setDonors(donorsData);
      setRecipients(recipientsData);
      setHospitals(hospitalsData);
      setDoctors(doctorsData);
      setMatches(matchesData);
      
      setStats({
        totalDonors: donorsData.length,
        totalPatients: recipientsData.length,
        totalHospitals: hospitalsData.length,
        totalDoctors: doctorsData.length,
        totalMatches: matchesData.length,
        successfulTransplants: matchesData.filter(m => m.status === 'completed').length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load data from database. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeDonors = donors.filter(d => d.availability);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="container mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Loading Admin Dashboard...</h2>
            <p className="text-muted-foreground">Fetching live data from Supabase</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the Life Source Nexus platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                {activeDonors.length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipients</CardTitle>
              <Hospital className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipients.length}</div>
              <p className="text-xs text-muted-foreground">
                {recipients.filter(r => r.urgency_level >= 8).length} critical
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matches.length}</div>
              <p className="text-xs text-muted-foreground">
                {matches.filter(m => m.status === 'pending').length} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.7%</div>
              <p className="text-xs text-muted-foreground">
                {stats.successfulTransplants} successful
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="donors">Donors</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approvals">
            <AdminApprovalPanel />
          </TabsContent>
          
          <TabsContent value="donors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Donors</CardTitle>
                <CardDescription>
                  All registered organ donors with live status updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donors.map((donor) => (
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
                            {donor.blood_type} • {donor.organ} • {donor.location || 'Location not specified'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={donor.availability ? "default" : "secondary"}>
                              {donor.availability ? "Available" : "Unavailable"}
                            </Badge>
                            <Badge variant="outline">
                              Registered: {new Date(donor.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-mono text-xs">{donor.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  ))}
                  {donors.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No donors registered yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recipients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
                <CardDescription>
                  Patients waiting for organ transplants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {recipient.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{recipient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {recipient.blood_type} • Needs {recipient.required_organ} • {recipient.location || 'Location not specified'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={recipient.urgency_level >= 8 ? "destructive" : recipient.urgency_level >= 6 ? "default" : "secondary"}>
                              Urgency: {recipient.urgency_level}/10
                            </Badge>
                            <Badge variant="outline">
                              Registered: {new Date(recipient.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-mono text-xs">{recipient.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  ))}
                  {recipients.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No recipients registered yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hospitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Hospitals</CardTitle>
                <CardDescription>
                  All registered healthcare facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {hospital.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{hospital.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {hospital.hospital_type} • {hospital.bed_capacity} beds • {hospital.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={hospital.approval_status === 'approved' ? "default" : hospital.approval_status === 'pending' ? "secondary" : "destructive"}>
                              {hospital.approval_status}
                            </Badge>
                            <Badge variant="outline">
                              License: {hospital.license_number}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-mono text-xs">{hospital.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  ))}
                  {hospitals.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No hospitals registered yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organ Matches</CardTitle>
                <CardDescription>
                  All organ matching records with blockchain verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Match Score: {match.match_score}%</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {match.status} • {new Date(match.matched_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={match.status === 'completed' ? "default" : match.status === 'pending' ? "secondary" : "destructive"}>
                              {match.status}
                            </Badge>
                            {match.blockchain_tx_hash && (
                              <Badge variant="outline">
                                <Shield className="h-3 w-3 mr-1" />
                                Blockchain Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Donor → Recipient</p>
                        <p className="font-mono text-xs">
                          {match.donor_id?.slice(0, 8)}... → {match.recipient_id?.slice(0, 8)}...
                        </p>
                        {match.blockchain_tx_hash && (
                          <p className="font-mono text-xs text-green-600">
                            TX: {match.blockchain_tx_hash.slice(0, 10)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No matches found yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
