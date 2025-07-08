import { useState, useEffect } from "react";
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
import { User, Stethoscope, Hospital, FileText, Award, GraduationCap } from "lucide-react";
import { DoctorProfile } from "@/models/userData";
import { registerDoctor, getStoredData } from "@/utils/dataStorage";

const specializations = [
  "Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics",
  "Surgery", "Transplant Surgery", "Anesthesiology", "Radiology", 
  "Pathology", "Internal Medicine", "Emergency Medicine", "Psychiatry",
  "Dermatology", "Ophthalmology", "ENT", "Urology", "Gynecology"
];

const certifications = [
  "Board Certified", "Fellowship Trained", "ACLS Certified", "BLS Certified",
  "Transplant Certified", "Trauma Certified", "Critical Care Certified",
  "Research Certified", "Teaching Certified"
];

const DoctorRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [availableHospitals, setAvailableHospitals] = useState<any[]>([]);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await getStoredData();
        setAvailableHospitals(data.hospitals.filter(h => h.isVerified));
      } catch (error) {
        console.error('Error loading hospitals:', error);
        setAvailableHospitals([]);
      }
    };
    loadHospitals();
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialization: [] as string[],
    hospitalId: "",
    licenseNumber: "",
    yearsOfExperience: "",
    certifications: [] as string[],
    bio: "",
    transplantExperience: "",
    education: "",
    achievements: ""
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
      const doctorProfile: DoctorProfile = {
        id: `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'doctor',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        registrationDate: new Date().toISOString(),
        specialization: formData.specialization,
        hospitalId: formData.hospitalId,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        certifications: formData.certifications,
        patientsCount: 0,
        transplantExperience: parseInt(formData.transplantExperience) || 0,
        rating: 4.8,
        bio: formData.bio
      };

      const success = registerDoctor(doctorProfile);
      
      if (success) {
        toast({
          title: "Doctor Registration Successful! 👨‍⚕️",
          description: "Your profile has been created. You can now access the medical staff directory.",
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
              <User className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Your basic details and contact information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Dr. John Smith"
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
                  placeholder="dr.smith@hospital.com"
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
                <Label htmlFor="licenseNumber">Medical License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  placeholder="MD123456789"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Your address"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Stethoscope className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Professional Details</h3>
              <p className="text-sm text-muted-foreground">Your medical expertise and experience</p>
            </div>
            
            <div>
              <Label>Specializations *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {specializations.map(spec => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec}
                      checked={formData.specialization.includes(spec)}
                      onCheckedChange={(checked) => handleArrayChange('specialization', spec, checked as boolean)}
                    />
                    <Label htmlFor={spec} className="text-sm">{spec}</Label>
                  </div>
                ))}
              </div>
              {formData.specialization.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.specialization.map(spec => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hospitalId">Affiliated Hospital *</Label>
                <Select value={formData.hospitalId} onValueChange={(value) => handleInputChange('hospitalId', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHospitals.map(hospital => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.hospitalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  placeholder="10"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="transplantExperience">Transplant Surgeries Performed</Label>
              <Input
                id="transplantExperience"
                type="number"
                value={formData.transplantExperience}
                onChange={(e) => handleInputChange('transplantExperience', e.target.value)}
                placeholder="25"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Certifications</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {certifications.map(cert => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={formData.certifications.includes(cert)}
                      onCheckedChange={(checked) => handleArrayChange('certifications', cert, checked as boolean)}
                    />
                    <Label htmlFor={cert} className="text-sm">{cert}</Label>
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
              <GraduationCap className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <p className="text-sm text-muted-foreground">Complete your professional profile</p>
            </div>
            
            <div>
              <Label htmlFor="education">Education Background</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Medical school, residency, fellowships..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Brief description of your experience and approach to patient care..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="achievements">Notable Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="Awards, publications, research, etc..."
                className="mt-1"
              />
            </div>
            
            <div className="border rounded-lg p-4 bg-primary/5">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Welcome to the Medical Network
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Your profile will be added to our medical staff directory</li>
                <li>• You can access patient records and organ matching data</li>
                <li>• Collaborate with other doctors and hospitals on the platform</li>
                <li>• Track transplant procedures and outcomes</li>
                <li>• Earn NFT certifications for successful procedures</li>
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
        return formData.name && formData.email && formData.phone && formData.licenseNumber;
      case 2:
        return formData.specialization.length > 0 && formData.hospitalId && formData.yearsOfExperience;
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
            <Stethoscope className="h-6 w-6 text-green-500" />
            Doctor Registration
          </CardTitle>
          <CardDescription>
            Join our network of medical professionals
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
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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

export default DoctorRegistrationForm;