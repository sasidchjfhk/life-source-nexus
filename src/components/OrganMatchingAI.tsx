
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dna, Brain, Sparkles } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";

// Mock data for organ matching
const mockRecipients = [
  { 
    id: "R-001", 
    name: "Emma Thompson", 
    age: 42, 
    bloodType: "O+", 
    organ: "Kidney", 
    urgency: "High",
    matchScore: 89,
    waitingTime: "8 months",
    location: "Memorial Hospital",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "R-002", 
    name: "James Wilson", 
    age: 35, 
    bloodType: "A-", 
    organ: "Liver", 
    urgency: "Medium",
    matchScore: 78,
    waitingTime: "5 months",
    location: "Central Medical",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "R-003", 
    name: "Sarah Johnson", 
    age: 29, 
    bloodType: "B+", 
    organ: "Heart", 
    urgency: "Critical",
    matchScore: 92,
    waitingTime: "3 months",
    location: "St. Mary's Hospital",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const mockDonors = [
  { 
    id: "D-001", 
    name: "Michael Brown", 
    age: 48, 
    bloodType: "O+", 
    organ: "Kidney", 
    status: "Available",
    matchScore: 85,
    registrationDate: "2025-01-15",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "D-002", 
    name: "Jessica Lee", 
    age: 39, 
    bloodType: "A+", 
    organ: "Liver", 
    status: "Available",
    matchScore: 76,
    registrationDate: "2025-02-08",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  { 
    id: "D-003", 
    name: "David Miller", 
    age: 52, 
    bloodType: "B-", 
    organ: "Heart", 
    status: "Available",
    matchScore: 91,
    registrationDate: "2025-03-22",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const OrganMatchingAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeModel, setActiveModel] = useState("claude");

  const runAIMatching = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setMatches([]);
    
    // Simulate AI processing with progress updates
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // After "processing" complete, show matches
    setTimeout(() => {
      clearInterval(interval);
      setProcessingProgress(100);
      
      // Generate matches between donors and recipients
      const generatedMatches = [];
      for (let i = 0; i < mockDonors.length; i++) {
        const donor = mockDonors[i];
        const recipient = mockRecipients[i];
        
        // Calculate a compatibility score based on various factors
        const bloodTypeCompatibility = donor.bloodType.charAt(0) === recipient.bloodType.charAt(0) || 
                                      donor.bloodType.charAt(0) === 'O' ? 100 : 60;
        
        const organsMatch = donor.organ === recipient.organ ? 100 : 0;
        
        // Overall compatibility score
        const compatibility = Math.round((bloodTypeCompatibility + organsMatch) / 2);
        
        generatedMatches.push({
          id: `M-00${i+1}`,
          donor,
          recipient,
          compatibility,
          reasons: [
            compatibility > 80 ? "Blood type highly compatible" : "Blood type compatibility challenges",
            donor.organ === recipient.organ ? "Organ type matches perfectly" : "Organ type mismatch",
            Math.abs(donor.age - recipient.age) < 10 ? "Age difference within optimal range" : "Significant age difference",
          ],
          predicted_success: compatibility > 80 ? "High (>90%)" : compatibility > 60 ? "Medium (70-80%)" : "Low (<60%)",
          predicted_complications: compatibility > 80 ? "Minimal" : "Moderate",
          recommendation: compatibility > 75 ? "Proceed with match" : "Consider alternative donors"
        });
      }
      
      setMatches(generatedMatches);
      setIsProcessing(false);
      
      toast({
        title: "AI Matching Complete",
        description: `Found ${generatedMatches.length} potential matches using Claude 3.9 Opus model`,
      });
    }, 4000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Organ Matching System
            </CardTitle>
            <CardDescription>
              Powered by advanced neural networks for optimal donor-recipient pairing
            </CardDescription>
          </div>
          
          <Tabs defaultValue="claude" onValueChange={setActiveModel} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="claude" className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Claude 3.9 Opus
              </TabsTrigger>
              <TabsTrigger value="gpt" className="flex items-center gap-1">
                <Dna className="h-3.5 w-3.5" />
                GPT-4o
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isProcessing ? (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <Dna className="h-16 w-16 mx-auto animate-pulse text-primary mb-4" />
              <h3 className="text-lg font-medium">Processing with {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Analyzing genetic compatibility, tissue matching, and medical history...
              </p>
            </div>
            <Progress value={processingProgress} className="h-2 w-full max-w-md mx-auto" />
            <p className="text-center text-sm text-muted-foreground">
              {processingProgress < 100 ? `${Math.round(processingProgress)}% complete` : "Finalizing results..."}
            </p>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">AI-Recommended Matches</h3>
            
            <Carousel className="w-full">
              <CarouselContent>
                {matches.map((match) => (
                  <CarouselItem key={match.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Match ID: {match.id}</CardTitle>
                        <CardDescription>
                          Compatibility: {match.compatibility}%
                          <Badge 
                            className="ml-2"
                            variant={match.compatibility > 80 ? "default" : match.compatibility > 60 ? "secondary" : "destructive"}
                          >
                            {match.compatibility > 80 ? "High" : match.compatibility > 60 ? "Medium" : "Low"}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={match.donor.image} 
                              alt={match.donor.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{match.donor.name}</p>
                            <p className="text-muted-foreground">Donor • {match.donor.age} • {match.donor.bloodType}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={match.recipient.image} 
                              alt={match.recipient.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">{match.recipient.name}</p>
                            <p className="text-muted-foreground">Recipient • {match.recipient.age} • {match.recipient.bloodType}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm mt-2">
                          <p className="font-medium">AI Assessment:</p>
                          <p className="text-xs text-muted-foreground">Success rate: {match.predicted_success}</p>
                          <p className="text-xs text-muted-foreground">Complications: {match.predicted_complications}</p>
                          <p className="text-xs font-medium mt-1 text-primary">{match.recommendation}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm" className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="h-24 w-24 mx-auto text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-lg font-medium">Ready to Find Optimal Matches</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Our AI engine uses {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} to analyze 
              thousands of variables including genetic markers, tissue compatibility, 
              medical history, and geographical proximity.
            </p>
            <Button onClick={runAIMatching} className="mt-6">
              Run AI Matching
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganMatchingAI;
