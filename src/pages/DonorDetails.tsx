import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/utils/dataStorage";
import { DonorProfile } from "@/models/userData";
import { 
  Heart, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  Award,
  ArrowLeft,
  Wallet,
  Star
} from "lucide-react";

const DonorDetails = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonor = async () => {
      if (id) {
        try {
          const result = await getUserById(id) as DonorProfile;
          setDonor(result);
        } catch (error) {
          console.error('Error loading donor:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadDonor();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!donor || donor.type !== 'donor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Donor Not Found</h2>
          <Button asChild>
            <Link to="/admin">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={donor.profileImage} />
              <AvatarFallback className="text-2xl">
                {donor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">{donor.name}</h1>
              <p className="text-lg text-muted-foreground">Registered Organ Donor</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={donor.isActive ? "default" : "secondary"}>
                  {donor.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Verified Donor
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{donor.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-medium">{donor.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{donor.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-medium">{donor.height} cm</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{donor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{donor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{donor.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Registered: {new Date(donor.registrationDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NFT Badges & Awards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                NFT Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Verified Donor</p>
                    <p className="text-xs text-muted-foreground">NFT Badge #001</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">Life Saver</p>
                    <p className="text-xs text-muted-foreground">NFT Badge #002</p>
                  </div>
                </div>
                
                {donor.walletAddress && (
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4" />
                      <span className="text-sm font-medium">Wallet Address</span>
                    </div>
                    <p className="text-xs font-mono bg-background p-2 rounded border">
                      {donor.walletAddress}
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Donor Score</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">95/100</div>
                  <p className="text-xs text-amber-600">Excellent compatibility rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registered Organs */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Organs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {donor.registeredOrgans.map((organ, index) => (
                  <Badge key={index} variant="outline" className="justify-center p-2">
                    {organ}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{donor.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{donor.emergencyContact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Relationship</p>
                <p className="font-medium">{donor.emergencyContact.relationship}</p>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              {donor.medicalHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {donor.medicalHistory.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No medical history recorded</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonorDetails;