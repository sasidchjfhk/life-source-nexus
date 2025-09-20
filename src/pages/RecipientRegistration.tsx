import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Heart, Users, Calendar, FileText, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const organs = [
  "Kidney", "Liver", "Heart", "Lung", "Pancreas", "Small Intestine", 
  "Cornea", "Skin", "Bone", "Heart Valve", "Blood Vessels"
];

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgencyLevels = [
  { value: 1, label: "Low Priority", description: "Stable condition, routine wait list" },
  { value: 5, label: "Medium Priority", description: "Moderate condition, may deteriorate" },
  { value: 8, label: "High Priority", description: "Serious condition, needs transplant soon" },
  { value: 10, label: "Critical Priority", description: "Life-threatening, immediate need" }
];

interface RecipientFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Medical Information
  bloodType: string;
  requiredOrgan: string;
  urgencyLevel: number;
  medicalCondition: string;
  currentMedications: string[];
  allergies: string[];
  previousSurgeries: string[];
  doctorName: string;
  hospitalName: string;
  
  // Additional Information
  insuranceProvider: string;
  policyNumber: string;
  consent: boolean;
  dataSharing: boolean;
}

const RecipientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RecipientFormData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    bloodType: "",
    requiredOrgan: "",
    urgencyLevel: 1,
    medicalCondition: "",
    currentMedications: [],
    allergies: [],
    previousSurgeries: [],
    doctorName: "",
    hospitalName: "",
    insuranceProvider: "",
    policyNumber: "",
    consent: false,
    dataSharing: false
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RecipientFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof RecipientFormData] as string[]), value]
        : (prev[field as keyof RecipientFormData] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('recipients')
        .insert([{
          name: formData.name,
          blood_type: formData.bloodType,
          required_organ: formData.requiredOrgan,
          urgency_level: formData.urgencyLevel,
          location: formData.address,
          approval_status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "Your recipient profile has been submitted for review. You'll receive confirmation within 24-48 hours.",
      });

      navigate("/");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.dateOfBirth && formData.address;
      case 2:
        return formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relationship;
      case 3:
        return formData.bloodType && formData.requiredOrgan && formData.urgencyLevel && formData.medicalCondition;
      case 4:
        return formData.doctorName && formData.hospitalName;
      case 5:
        return formData.insuranceProvider && formData.policyNumber && formData.consent;
      default:
        return false;
    }
  };

  const progress = (currentStep / 5) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with your basic information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State, ZIP Code"
                rows={3}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary">Emergency Contact</h2>
              <p className="text-muted-foreground">Who should we contact in case of emergency?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName" className="text-sm font-medium">Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  placeholder="Jane Doe"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone" className="text-sm font-medium">Contact Phone *</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  placeholder="+1 (555) 987-6543"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="relationship" className="text-sm font-medium">Relationship *</Label>
                <Select onValueChange={(value) => handleInputChange('emergencyContact.relationship', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Heart className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary">Medical Information</h2>
              <p className="text-muted-foreground">Critical information for organ matching</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType" className="text-sm font-medium">Blood Type *</Label>
                <Select onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredOrgan" className="text-sm font-medium">Required Organ *</Label>
                <Select onValueChange={(value) => handleInputChange('requiredOrgan', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select required organ" />
                  </SelectTrigger>
                  <SelectContent>
                    {organs.map(organ => (
                      <SelectItem key={organ} value={organ}>{organ}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Urgency Level *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {urgencyLevels.map(level => (
                  <div key={level.value} className="space-y-2">
                    <Button
                      type="button"
                      variant={formData.urgencyLevel === level.value ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleInputChange('urgencyLevel', level.value)}
                    >
                      <span className="font-medium">{level.label}</span>
                    </Button>
                    <p className="text-xs text-muted-foreground px-3">{level.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalCondition" className="text-sm font-medium">Medical Condition *</Label>
              <Textarea
                id="medicalCondition"
                value={formData.medicalCondition}
                onChange={(e) => handleInputChange('medicalCondition', e.target.value)}
                placeholder="Please describe your current medical condition and diagnosis..."
                rows={4}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary">Medical Team</h2>
              <p className="text-muted-foreground">Information about your healthcare providers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName" className="text-sm font-medium">Primary Doctor *</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  placeholder="Dr. Smith"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalName" className="text-sm font-medium">Hospital/Medical Center *</Label>
                <Input
                  id="hospitalName"
                  value={formData.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                  placeholder="City Medical Center"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Medications</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Immunosuppressants", "Blood thinners", "Blood pressure medication", "Diabetes medication", "Pain medication", "Other"].map(medication => (
                    <div key={medication} className="flex items-center space-x-2">
                      <Checkbox 
                        id={medication}
                        checked={formData.currentMedications.includes(medication)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('currentMedications', medication, checked as boolean)
                        }
                      />
                      <Label htmlFor={medication} className="text-sm">{medication}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Known Allergies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Penicillin", "Latex", "Iodine", "Aspirin", "Sulfa drugs", "None"].map(allergy => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox 
                        id={allergy}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('allergies', allergy, checked as boolean)
                        }
                      />
                      <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary">Final Details</h2>
              <p className="text-muted-foreground">Insurance information and consent</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider" className="text-sm font-medium">Insurance Provider *</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  placeholder="Blue Cross Blue Shield"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyNumber" className="text-sm font-medium">Policy Number *</Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  placeholder="ABC123456789"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  By proceeding, you acknowledge that all information provided is accurate and complete.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm leading-relaxed">
                    I consent to organ transplantation and understand the medical procedures involved. I agree to follow all medical recommendations and treatment plans. *
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="dataSharing"
                    checked={formData.dataSharing}
                    onCheckedChange={(checked) => handleInputChange('dataSharing', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="dataSharing" className="text-sm leading-relaxed">
                    I agree to share my medical data securely with qualified medical professionals and transplant coordinators for matching purposes.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Life Source Nexus</h1>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Recipient Registration
          </Badge>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Recipient Registration
                </h1>
                <p className="text-muted-foreground mt-1">
                  Step {currentStep} of 5 - {Math.round(progress)}% Complete
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  Estimated time: 10-15 minutes
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-lg health-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <CardTitle className="text-center">Medical Recipient Profile</CardTitle>
              <CardDescription className="text-center">
                Help us create your comprehensive recipient profile for organ matching
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep === 5 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="flex items-center gap-2 medical-gradient"
                  >
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                    <Heart className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecipientRegistration;