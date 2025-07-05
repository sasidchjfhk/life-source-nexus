import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredData, getStatistics } from "@/utils/dataStorage";
import { DonorProfile, HospitalProfile, DoctorProfile } from "@/models/userData";
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
  const [data, setData] = useState(getStoredData());
  const [stats, setStats] = useState(getStatistics());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getStoredData());
      setStats(getStatistics());
    }, 5000); // Refresh every 5 seconds for live updates

    return () => clearInterval(interval);
  }, []);

  const pendingHospitals = data.hospitals.filter(h => !h.isVerified);
  const verifiedHospitals = data.hospitals.filter(h => h.isVerified);
  const activeDonors = data.donors.filter(d => d.isActive);

  const approveHospital = (hospitalId: string) => {
    const currentData = getStoredData();
    const updatedHospitals = currentData.hospitals.map(h => 
      h.id === hospitalId ? { ...h, isVerified: true } : h
    );
    const updatedData = { ...currentData, hospitals: updatedHospitals };
    localStorage.setItem('lifesource_data', JSON.stringify(updatedData));
    setData(updatedData);
  };

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
              <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
              <Hospital className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.hospitals.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingHospitals.length} pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeMatches} active matches
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

        <Tabs defaultValue="donors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donors">Donors</TabsTrigger>
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="approvals">
              Approvals
              {pendingHospitals.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingHospitals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
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
                  {data.donors.map((donor: DonorProfile) => (
                    <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={donor.profileImage} />
                          <AvatarFallback>
                            {donor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{donor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {donor.age} years • {donor.bloodType} • {donor.registeredOrgans.join(', ')}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={donor.isActive ? "default" : "secondary"}>
                              {donor.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {donor.nftBadges.length > 0 && (
                              <Badge variant="outline" className="bg-purple-50">
                                <Award className="h-3 w-3 mr-1" />
                                {donor.nftBadges.length} NFT Badges
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/donor/${donor.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {data.donors.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No donors registered yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hospitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Network</CardTitle>
                <CardDescription>
                  Verified healthcare facilities in the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verifiedHospitals.map((hospital: HospitalProfile) => (
                    <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Hospital className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{hospital.hospitalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {hospital.hospitalType} • {hospital.totalTransplants} transplants
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                            <Badge variant="outline">
                              Success Rate: {hospital.successRate}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-bold text-lg">{hospital.rating}/5</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Staff</CardTitle>
                <CardDescription>
                  Registered doctors and medical professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.doctors.map((doctor: DoctorProfile) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={doctor.profileImage} />
                          <AvatarFallback>
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. {doctor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization.join(', ')} • {doctor.yearsOfExperience} years exp.
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              License: {doctor.licenseNumber}
                            </Badge>
                            <Badge variant="secondary">
                              {doctor.patientsCount} patients
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-bold text-lg">{doctor.rating}/5</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approvals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  Hospital registrations awaiting verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingHospitals.map((hospital: HospitalProfile) => (
                    <div key={hospital.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">{hospital.hospitalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {hospital.hospitalType} • Registered: {new Date(hospital.registrationDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {hospital.email} • {hospital.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => approveHospital(hospital.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingHospitals.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No pending approvals
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
