
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dna, Brain, Sparkles, Heart, Zap, Bot } from "lucide-react";
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

// Model info
const modelInfo = {
  claude: {
    name: "Claude 3.9 Opus",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Advanced genetic compatibility analysis with 98.7% accuracy",
    image: "https://images.unsplash.com/photo-1677442135436-7056d4ddd7c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  gpt: {
    name: "GPT-4o",
    icon: <Bot className="h-4 w-4" />,
    description: "Specialized in medical history pattern recognition",
    image: "https://images.unsplash.com/photo-1684921663588-a2a1277cccbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
};

const OrganMatchingAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [activeModel, setActiveModel] = useState("claude");
  const [showModelInfo, setShowModelInfo] = useState(false);

  // Auto-run AI matching when component mounts
  useEffect(() => {
    if (matches.length === 0 && !isProcessing) {
      runAIMatching();
    }
  }, []);

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
        description: `Found ${generatedMatches.length} potential matches using ${activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} model`,
      });
    }, 4000);
  };

  return (
    <Card className="w-full border-gradient-to-r from-primary/30 to-primary/10 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
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
        
        {/* Model information banner */}
        <div 
          className={`mt-4 rounded-lg p-3 bg-primary/5 border border-primary/20 transition-all duration-300 overflow-hidden ${showModelInfo ? 'max-h-96' : 'max-h-0 border-0 p-0 mt-0'}`}
        >
          {showModelInfo && (
            <div className="flex gap-4">
              <div className="rounded-md overflow-hidden w-24 h-24 flex-shrink-0">
                <img 
                  src={activeModel === "claude" ? modelInfo.claude.image : modelInfo.gpt.image} 
                  alt={activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{activeModel === "claude" ? modelInfo.claude.name : modelInfo.gpt.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {activeModel === "claude" ? modelInfo.claude.description : modelInfo.gpt.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {activeModel === "claude" ? "98.7% Accuracy" : "96.2% Accuracy"}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {activeModel === "claude" ? "Genetic Analysis" : "Medical History Analysis"}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    {activeModel === "claude" ? "Anthropic's Latest Model" : "OpenAI's Latest Model"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowModelInfo(!showModelInfo)} 
          className="mt-2 text-xs text-muted-foreground hover:text-primary"
        >
          {showModelInfo ? "Hide model details" : "Show model details"} 
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isProcessing ? (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                  {activeModel === "claude" ? 
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" /> : 
                    <Dna className="h-8 w-8 text-primary animate-pulse" />}
                </div>
              </div>
              
              <h3 className="text-lg font-medium">Processing with {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                {activeModel === "claude" ? 
                  "Analyzing genetic markers, tissue compatibility, and organ viability..." : 
                  "Evaluating medical history, immunology, and transplant success factors..."}
              </p>
            </div>
            <Progress value={processingProgress} className="h-2 w-full max-w-md mx-auto" />
            <p className="text-center text-sm text-muted-foreground">
              {processingProgress < 100 ? `${Math.round(processingProgress)}% complete` : "Finalizing results..."}
            </p>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" /> 
                {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} Recommended Matches
              </h3>
              <Badge variant="outline" className="bg-primary/10">
                {matches.length} matches found
              </Badge>
            </div>
            
            <Carousel className="w-full">
              <CarouselContent>
                {matches.map((match) => (
                  <CarouselItem key={match.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden border-gradient-to-b from-primary/10 to-transparent">
                      <CardHeader className="pb-2 bg-gradient-to-b from-primary/5 to-transparent">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Match ID: {match.id}</CardTitle>
                          <div className="flex items-center gap-1">
                            {activeModel === "claude" ? 
                              <Sparkles className="h-3 w-3 text-amber-500" /> : 
                              <Bot className="h-3 w-3 text-blue-500" />}
                            <span className="text-xs text-muted-foreground">
                              {activeModel === "claude" ? "Claude 3.9" : "GPT-4o"}
                            </span>
                          </div>
                        </div>
                        <CardDescription className="flex items-center">
                          Compatibility: 
                          <span className={`ml-1 font-medium ${
                            match.compatibility > 80 ? "text-green-500" : 
                            match.compatibility > 60 ? "text-blue-500" : 
                            "text-red-500"
                          }`}>
                            {match.compatibility}%
                          </span>
                          <Badge 
                            className="ml-2"
                            variant={match.compatibility > 80 ? "default" : match.compatibility > 60 ? "secondary" : "destructive"}
                          >
                            {match.compatibility > 80 ? "High" : match.compatibility > 60 ? "Medium" : "Low"}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-primary/20">
                            <AvatarImage src={match.donor.image} alt={match.donor.name} />
                            <AvatarFallback>{match.donor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{match.donor.name}</p>
                            <p className="text-muted-foreground">Donor • {match.donor.age} • {match.donor.bloodType}</p>
                          </div>
                        </div>
                        
                        <div className="relative py-2">
                          <div className="absolute left-8 top-0 h-full w-0.5 bg-primary/20"></div>
                          <div className="absolute left-8 top-1/2 w-5 h-0.5 bg-primary/20"></div>
                          <Zap className="h-4 w-4 text-primary absolute left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-primary/20">
                            <AvatarImage src={match.recipient.image} alt={match.recipient.name} />
                            <AvatarFallback>{match.recipient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{match.recipient.name}</p>
                            <p className="text-muted-foreground">Recipient • {match.recipient.age} • {match.recipient.bloodType}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-4 w-4 text-primary" />
                            <p className="font-medium">AI Assessment:</p>
                          </div>
                          <div className="ml-6 space-y-1">
                            <p className="text-xs text-muted-foreground flex justify-between">
                              <span>Success rate:</span> 
                              <span className="font-medium">{match.predicted_success}</span>
                            </p>
                            <p className="text-xs text-muted-foreground flex justify-between">
                              <span>Complications:</span> 
                              <span className="font-medium">{match.predicted_complications}</span>
                            </p>
                            <p className="text-xs font-medium mt-1 text-primary">{match.recommendation}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button size="sm" className="w-full gap-2">
                          <Heart className="h-4 w-4" />
                          View Details
                        </Button>
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
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-primary/5"></div>
              <div className="absolute inset-2 rounded-full bg-primary/10"></div>
              <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                {activeModel === "claude" ? 
                  <Sparkles className="h-8 w-8 text-muted-foreground opacity-60" /> : 
                  <Dna className="h-8 w-8 text-muted-foreground opacity-60" />}
              </div>
            </div>
            <h3 className="text-lg font-medium">Ready to Find Optimal Matches</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Our AI engine uses {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} to analyze 
              thousands of variables including genetic markers, tissue compatibility, 
              medical history, and geographical proximity.
            </p>
            <Button onClick={runAIMatching} className="mt-6 gap-2">
              {activeModel === "claude" ? <Sparkles className="h-4 w-4" /> : <Dna className="h-4 w-4" />}
              Run {activeModel === "claude" ? "Claude 3.9 Opus" : "GPT-4o"} Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganMatchingAI;
