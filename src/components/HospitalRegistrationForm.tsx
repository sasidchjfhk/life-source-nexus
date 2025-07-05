import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Hospital, MapPin, Phone, Mail, FileText, Shield, Users, Building } from "lucide-react";
import { HospitalProfile } from "@/models/userData";
import { registerHospital } from "@/utils/dataStorage";

const hospitalServices = [
  "Emergency Care", "Cardiology", "Neurology", "Orthopedics", "Oncology", 
  "Pediatrics", "Transplant Surgery", "ICU", "Surgery", "Radiology",
  "Pathology", "Pharmacy", "Blood Bank", "Dialysis"
];

const hospitalTypes = [
  "General Hospital", "Teaching Hospital", "Specialty Hospital", 
  "Children's Hospital", "Trauma Center", "Cancer Center"
];

const HospitalRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hospitalName: "",
    hospitalType: "",
    email: "",
    phone: "",
    address: "",
    capacity: "",
    operatingHours: "",
    servicesOffered: [] as string[],
    licenseNumber: "",
    accreditations: [] as string[],
    transplantCertifications: [] as string[],
    latitude: "",
    longitude: "",
    totalTransplants: "",
    successRate: "",
    description: ""
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async () => {
    try {
      const hospitalProfile: HospitalProfile = {
        id: `H-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'hospital',
        name: formData.hospitalName,
        hospitalName: formData.hospitalName,
        hospitalType: formData.hospitalType,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        registrationDate: new Date().toISOString(),
        capacity: parseInt(formData.capacity) || 100,
        operatingHours: formData.operatingHours,
        servicesOffered: formData.servicesOffered,
        transplantCertifications: formData.transplantCertifications,
        accreditations: formData.accreditations,
        coordinates: {
          lat: parseFloat(formData.latitude) || 40.7128,
          lng: parseFloat(formData.longitude) || -74.0060
        },
        isVerified: false, // Requires admin approval
        rating: 4.5,
        totalTransplants: parseInt(formData.totalTransplants) || 0,
        successRate: parseFloat(formData.successRate) || 90
      };

      const success = registerHospital(hospitalProfile);
      
      if (success) {
        toast({
          title: "Hospital Registration Submitted! 🏥",
          description: "Your application has been submitted for admin verification. You'll receive an email once approved.",
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error("Failed to save registration data");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Hospital className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Hospital Information</h3>
              <p className="text-sm text-muted-foreground">Basic details about your healthcare facility</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                  placeholder="City Medical Center"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="hospitalType">Hospital Type *</Label>
                <Select value={formData.hospitalType} onValueChange={(value) => handleInputChange('hospitalType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select hospital type" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity">Bed Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="200"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Official Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="info@hospital.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Contact Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Hospital Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Complete hospital address"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                value={formData.operatingHours}
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                placeholder="24/7 Emergency, 8 AM - 6 PM Regular"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Certifications & Services</h3>
              <p className="text-sm text-muted-foreground">Your hospital's capabilities and certifications</p>
            </div>
            
            <div>
              <Label>Services Offered *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {hospitalServices.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.servicesOffered.includes(service)}
                      onCheckedChange={(checked) => handleArrayChange('servicesOffered', service, checked as boolean)}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
              {formData.servicesOffered.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.servicesOffered.map(service => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">Hospital License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="LIC123456789"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="totalTransplants">Total Transplants Performed</Label>
                <Input
                  id="totalTransplants"
                  type="number"
                  value={formData.totalTransplants}
                  onChange={(e) => handleInputChange('totalTransplants', e.target.value)}
                  placeholder="150"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="successRate">Success Rate (%)</Label>
              <Input
                id="successRate"
                type="number"
                min="0"
                max="100"
                value={formData.successRate}
                onChange={(e) => handleInputChange('successRate', e.target.value)}
                placeholder="95"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Building className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Final Details</h3>
              <p className="text-sm text-muted-foreground">Complete your hospital registration</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (for mapping)</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="40.7128"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude (for mapping)</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="-74.0060"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Hospital Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your hospital and its mission..."
                className="mt-1"
              />
            </div>
            
            <div className="border rounded-lg p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Verification Process
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Your application will be reviewed by our admin team</li>
                <li>• We'll verify your hospital license and certifications</li>
                <li>• You'll receive an email notification once approved</li>
                <li>• Approved hospitals get full access to the platform</li>
                <li>• You can track organ requests and donor matches</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.hospitalName && formData.hospitalType && formData.email && formData.phone && formData.address && formData.capacity;
      case 2:
        return formData.servicesOffered.length > 0 && formData.licenseNumber;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Hospital className="h-6 w-6 text-blue-500" />
            Hospital Registration
          </CardTitle>
          <CardDescription>
            Join our network of trusted healthcare providers
          </CardDescription>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalRegistrationForm;