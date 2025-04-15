
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { Building2, CheckCircle, XCircle, FileText, MapPin, Phone, Mail, Shield } from "lucide-react";

interface HospitalData {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  status: "pending" | "approved" | "rejected";
  dateApplied: string;
}

const HospitalVerificationCard = () => {
  const { verifyHospital } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null);

  // Mock hospital data
  const hospitals: HospitalData[] = [
    {
      id: "H-001",
      name: "City Medical Center",
      address: "123 Medical Ave, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "admin@citymedical.org",
      licenseNumber: "MED-12345-NY",
      status: "pending",
      dateApplied: "2025-04-10"
    },
    {
      id: "H-002",
      name: "St. John's Hospital",
      address: "456 Health Blvd, Chicago, IL 60601",
      phone: "+1 (555) 987-6543",
      email: "info@stjohns-hospital.org",
      licenseNumber: "MED-67890-IL",
      status: "pending",
      dateApplied: "2025-04-12"
    },
    {
      id: "H-003",
      name: "Mercy Health Clinic",
      address: "789 Wellness Dr, Los Angeles, CA 90001",
      phone: "+1 (555) 456-7890",
      email: "contact@mercyhealth.org",
      licenseNumber: "MED-54321-CA",
      status: "pending",
      dateApplied: "2025-04-14"
    }
  ];

  const handleVerify = async (approve: boolean) => {
    if (!selectedHospital) return;
    
    setIsLoading(true);
    try {
      if (approve) {
        const isVerified = await verifyHospital(selectedHospital.id);
        if (isVerified) {
          toast({
            title: "Hospital Verified",
            description: `${selectedHospital.name} has been verified successfully.`,
          });
          // Update local state to show approved
          setSelectedHospital({
            ...selectedHospital,
            status: "approved"
          });
        } else {
          toast({
            title: "Verification Failed",
            description: "There was an error verifying the hospital. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Hospital Rejected",
          description: `${selectedHospital.name} has been rejected.`,
        });
        // Update local state to show rejected
        setSelectedHospital({
          ...selectedHospital,
          status: "rejected"
        });
      }
    } catch (error) {
      console.error("Error verifying hospital:", error);
      toast({
        title: "Operation Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-100/50 to-transparent dark:from-blue-900/30 dark:to-transparent">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <CardTitle>Hospital Verification</CardTitle>
        </div>
        <CardDescription>
          Review and verify hospital registration requests
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1">
            {hospitals.map((hospital) => (
              <div 
                key={hospital.id}
                className={`p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors ${selectedHospital?.id === hospital.id ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{hospital.name}</h3>
                  {getStatusBadge(hospital.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID:</span> {hospital.id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Applied:</span> {hospital.dateApplied}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedHospital && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedHospital.name}</h3>
                {getStatusBadge(selectedHospital.status)}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>License: {selectedHospital.licenseNumber}</span>
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Verification Status</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedHospital.status === "pending" ? (
                    "This hospital requires verification before it can participate in organ donation procedures."
                  ) : selectedHospital.status === "approved" ? (
                    "This hospital has been verified and can participate in organ donation procedures."
                  ) : (
                    "This hospital has been rejected and cannot participate in organ donation procedures."
                  )}
                </div>
              </div>
              
              {selectedHospital.status === "pending" && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleVerify(false)}
                    disabled={isLoading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => handleVerify(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>Verifying... <span className="ml-2 animate-spin">◌</span></>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalVerificationCard;
