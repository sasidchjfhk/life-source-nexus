
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
import { toast } from "@/components/ui/use-toast";
import { Heart, User, Phone, MapPin, Droplets, Calendar, Weight, Ruler, FileText, Users, Shield, Sparkles } from "lucide-react";
import { DonorProfile } from "@/models/userData";
import { registerDonor } from "@/utils/dataStorage";
import { useAuth } from "@/App";

const organs = [
  "Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Small Intestine", 
  "Corneas", "Skin", "Bone", "Bone Marrow", "Blood Vessels", "Heart Valves"
];

const bloodTypes = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

const EnhancedDonorRegistrationForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    address: "",
    
    // Medical Information
    bloodType: "",
    age: "",
    weight: "",
    height: "",
    medicalHistory: [] as string[],
    
    // Organ Donation Preferences
    registeredOrgans: [] as string[],
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    
    // Preferences
    geographicLimit: "50",
    urgencyOnly: false,
    anonymousMatching: true,
    
    // Additional
    additionalNotes: ""
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string | boolean) => {
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
      const donorProfile: DonorProfile = {
        id: `D-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'donor',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        registrationDate: new Date().toISOString(),
        bloodType: formData.bloodType,
        age: parseInt(formData.age),
        weight: parseInt(formData.weight),
        height: parseInt(formData.height),
        medicalHistory: formData.medicalHistory,
        registeredOrgans: formData.registeredOrgans,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        },
        isActive: true,
        nftBadges: [`donor-registration-${Date.now()}`],
        matchingPreferences: {
          geographicLimit: parseInt(formData.geographicLimit),
          urgencyOnly: formData.urgencyOnly,
          anonymousMatching: formData.anonymousMatching
        }
      };

      const success = registerDonor(donorProfile);
      
      if (success) {
        // Auto-login the user
        login(formData.name, 'donor');
        
        toast({
          title: "Registration Successful! 🎉",
          description: "Your donor profile has been created and stored securely. You can now access your dashboard.",
        });
        
        // Navigate to donor dashboard
        setTimeout(() => {
          navigate('/donor-dashboard');
        }, 2000);
      } else {
        throw new Error("Failed to save registration data");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error saving your registration. Please try again.",
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
              <User className="h-12 w-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="25"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete address"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Droplets className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <p className="text-sm text-muted-foreground">Your medical details for safe donation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodType">Blood Type *</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="70"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="175"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label>Medical History (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {["Diabetes", "Hypertension", "Heart Disease", "Cancer", "Kidney Disease", "Liver Disease", "None"].map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.medicalHistory.includes(condition)}
                      onCheckedChange={(checked) => handleArrayChange('medicalHistory', condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Organ Donation Preferences</h3>
              <p className="text-sm text-muted-foreground">Choose which organs you'd like to donate</p>
            </div>
            
            <div>
              <Label>Organs You Wish to Donate *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {organs.map(organ => (
                  <div key={organ} className="flex items-center space-x-2">
                    <Checkbox
                      id={organ}
                      checked={formData.registeredOrgans.includes(organ)}
                      onCheckedChange={(checked) => handleArrayChange('registeredOrgans', organ, checked as boolean)}
                    />
                    <Label htmlFor={organ} className="text-sm">{organ}</Label>
                  </div>
                ))}
              </div>
              {formData.registeredOrgans.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.registeredOrgans.map(organ => (
                    <Badge key={organ} variant="secondary">{organ}</Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Contact person name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  placeholder="Contact phone number"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                <Select value={formData.emergencyContactRelationship} onValueChange={(value) => handleInputChange('emergencyContactRelationship', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Preferences & Final Steps</h3>
              <p className="text-sm text-muted-foreground">Customize your donation preferences</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="geographicLimit">Geographic Limit (miles)</Label>
                <Select value={formData.geographicLimit} onValueChange={(value) => handleInputChange('geographicLimit', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100 miles</SelectItem>
                    <SelectItem value="500">500 miles</SelectItem>
                    <SelectItem value="1000">No limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgencyOnly"
                  checked={formData.urgencyOnly}
                  onCheckedChange={(checked) => handleInputChange('urgencyOnly', checked as boolean)}
                />
                <Label htmlFor="urgencyOnly">Only match with urgent/critical cases</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymousMatching"
                  checked={formData.anonymousMatching}
                  onCheckedChange={(checked) => handleInputChange('anonymousMatching', checked as boolean)}
                />
                <Label htmlFor="anonymousMatching">Keep my identity anonymous to recipients</Label>
              </div>
              
              <div>
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                What happens next?
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Your profile will be securely stored on the blockchain</li>
                <li>• You'll receive an NFT badge certifying your donor status</li>
                <li>• AI will automatically match you with compatible recipients</li>
                <li>• You'll get notifications about potential matches</li>
                <li>• You can manage your preferences anytime from your dashboard</li>
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
        return formData.name && formData.email && formData.phone && formData.age && formData.address;
      case 2:
        return formData.bloodType && formData.weight && formData.height;
      case 3:
        return formData.registeredOrgans.length > 0 && formData.emergencyContactName && formData.emergencyContactPhone && formData.emergencyContactRelationship;
      case 4:
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
            <Heart className="h-6 w-6 text-red-500" />
            Donor Registration
          </CardTitle>
          <CardDescription>
            Join thousands of life-savers on our blockchain-powered platform
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
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Complete Registration
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDonorRegistrationForm;
