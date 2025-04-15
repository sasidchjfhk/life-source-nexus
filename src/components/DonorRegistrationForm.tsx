
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Heart, 
  Dna, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Shield, 
  Wallet, 
  AlertCircle,
  ArrowRight,
  BadgeCheck
} from "lucide-react";

// Form schema for validation
const donorFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  birthDate: z.string().refine(date => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, "You must be at least 18 years old"),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state/province"),
  zipCode: z.string().min(5, "Please enter a valid postal/zip code"),
  bloodType: z.string().min(1, "Please select your blood type"),
  registerAs: z.string().min(1, "Please select how you want to register"),
  organs: z.array(z.string()).min(1, "Please select at least one organ to donate"),
  medicalHistory: z.string().optional(),
  emergencyContactName: z.string().min(2, "Please provide an emergency contact name"),
  emergencyContactPhone: z.string().min(10, "Please provide a valid emergency contact number"),
  consentLegal: z.boolean().refine(value => value === true, {
    message: "You must agree to the legal consent",
  }),
  consentPrivacy: z.boolean().refine(value => value === true, {
    message: "You must agree to the privacy policy",
  }),
});

const DonorRegistrationForm = () => {
  const navigate = useNavigate();
  const { walletAddress, walletStatus, connectWallet, mintNFTBadge } = useWeb3();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiMatchScore, setAiMatchScore] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof donorFormSchema>>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bloodType: "",
      registerAs: "donor",
      organs: [],
      medicalHistory: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      consentLegal: false,
      consentPrivacy: false,
    },
  });

  // Available organs for donation
  const availableOrgans = [
    { id: "kidney", label: "Kidney" },
    { id: "liver", label: "Liver" },
    { id: "heart", label: "Heart" },
    { id: "lungs", label: "Lungs" },
    { id: "pancreas", label: "Pancreas" },
    { id: "intestines", label: "Intestines" },
    { id: "corneas", label: "Corneas" },
    { id: "tissue", label: "Tissue" },
    { id: "bone_marrow", label: "Bone Marrow" },
  ];

  // Simulate AI matching score calculation
  const calculateMatchScore = (data: z.infer<typeof donorFormSchema>) => {
    // In a real app, this would call an API with machine learning model
    // Here we're just simulating with random score + blood type factor
    const baseScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
    
    // Add blood type factor
    let bloodTypeFactor = 0;
    if (data.bloodType === "O-") bloodTypeFactor = 10; // Universal donor gets bonus
    if (data.bloodType === "AB+") bloodTypeFactor = -5; // Universal recipient gets penalty
    
    // Add organ factor
    const organFactor = Math.min(data.organs.length * 2, 10); // More organs, higher score (max +10)
    
    return Math.min(Math.max(baseScore + bloodTypeFactor + organFactor, 1), 99);
  };

  // Function to handle form submission
  const onSubmit = async (data: z.infer<typeof donorFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Calculate AI match score
      const matchScore = calculateMatchScore(data);
      setAiMatchScore(matchScore);
      
      // Connect wallet if not already connected
      if (walletStatus !== 'connected') {
        await connectWallet();
      }
      
      // Simulate blockchain registration (would actually call smart contract in real app)
      setTimeout(async () => {
        // Mint NFT badge for the donor
        if (walletStatus === 'connected') {
          const badgeName = "Organ Donor Badge";
          await mintNFTBadge(badgeName);
        }
        
        toast({
          title: "Registration Successful",
          description: "Your donor information has been securely registered on the blockchain.",
        });
        
        // Redirect to the donor dashboard after successful registration
        setTimeout(() => {
          navigate("/donor-dashboard");
        }, 2000);
        
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Navigate between form steps
  const nextStep = () => {
    const fieldsToValidate = currentStep === 1 
      ? ["firstName", "lastName", "email", "phone", "birthDate", "address", "city", "state", "zipCode"] 
      : ["bloodType", "registerAs", "organs", "emergencyContactName", "emergencyContactPhone"];
    
    form.trigger(fieldsToValidate as any).then(isValid => {
      if (isValid) setCurrentStep(currentStep + 1);
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full backdrop-blur-sm bg-card/90 border-border/50 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Form Steps Indicator */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <User size={16} />
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Personal Information</span>
              </div>
              <div className="w-10 h-[2px] bg-border sm:w-20"></div>
              <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Heart size={16} />
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Medical Details</span>
              </div>
              <div className="w-10 h-[2px] bg-border sm:w-20"></div>
              <div className={`flex items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Wallet size={16} />
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">Blockchain Registration</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center mb-6">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="email@example.com" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>You must be at least 18 years old to register.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="123 Main St" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal/Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Medical Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-center mb-6">Medical Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registerAs"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>I am registering as</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="donor" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Organ Donor
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="recipient" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Organ Recipient
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="both" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Both Donor & Recipient
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organs"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Organs I wish to donate</FormLabel>
                            <FormDescription>
                              Select the organs you're willing to donate after death.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                            {availableOrgans.map((organ) => (
                              <FormField
                                key={organ.id}
                                control={form.control}
                                name="organs"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={organ.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(organ.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, organ.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== organ.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {organ.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="medicalHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relevant Medical History (Optional)</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="List any relevant medical conditions or medications..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>This information will be encrypted and only shared with medical professionals.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="+1 (555) 987-6543" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Blockchain Registration */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Blockchain Registration</h2>
                    
                    <div className="rounded-lg border p-4 bg-secondary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Data Security & Privacy</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your sensitive medical information will be encrypted. Only anonymized metadata
                        about your organ donation preferences will be stored on the blockchain to ensure 
                        security, transparency, and immutability.
                      </p>
                    </div>
                    
                    {/* Wallet Connection */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">Blockchain Wallet</h3>
                        </div>
                        {walletStatus === 'connected' ? (
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Connected
                          </div>
                        ) : (
                          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
                            {walletStatus === 'connecting' ? 'Connecting...' : 'Not Connected'}
                          </div>
                        )}
                      </div>
                      
                      {walletStatus === 'connected' ? (
                        <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
                          {walletAddress}
                        </div>
                      ) : (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full" 
                          onClick={connectWallet}
                          disabled={walletStatus === 'connecting'}
                        >
                          {walletStatus === 'connecting' ? (
                            <>Connecting Wallet... <span className="ml-2 animate-spin">◌</span></>
                          ) : (
                            <>Connect Wallet</>
                          )}
                        </Button>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        A Web3 wallet is required to store your NFT donor badge and securely 
                        register your information on the blockchain.
                      </p>
                    </div>
                    
                    {/* NFT Badge Preview */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BadgeCheck className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">NFT Donor Badge</h3>
                      </div>
                      
                      <div className="flex justify-center mb-3">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/50">
                          <Heart className="h-10 w-10 text-primary" />
                        </div>
                      </div>
                      
                      <p className="text-sm text-center text-muted-foreground">
                        Upon registration, you'll receive a unique NFT badge 
                        certifying your status as an organ donor.
                      </p>
                    </div>
                    
                    {/* AI Matching Preview */}
                    {aiMatchScore !== null && (
                      <div className="rounded-lg border p-4 bg-gradient-to-r from-green-100/50 to-blue-100/50 dark:from-green-900/20 dark:to-blue-900/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Dna className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">AI Match Prediction</h3>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center text-2xl font-bold mb-2">
                            {aiMatchScore}%
                          </div>
                          <p className="text-sm text-center">
                            Based on your profile, our AI predicts this match compatibility score.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Legal Consent */}
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="consentLegal"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I consent to donate the selected organs after my death for transplantation, therapy, 
                                research, or education as allowed by law.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="consentPrivacy"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the <a href="#" className="text-primary underline">Privacy Policy</a> and 
                                understand how my data will be stored on the blockchain.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {currentStep > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => navigate("/")}>
                      Cancel
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep}>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      {isSubmitting ? (
                        <>Processing... <span className="ml-2 animate-spin">◌</span></>
                      ) : (
                        <>Complete Registration</>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorRegistrationForm;
