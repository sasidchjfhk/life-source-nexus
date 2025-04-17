
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles, Dna } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { modelInfo } from "@/models/aiModels";
import { Match } from "@/models/organMatchingData";
import { generateMatches } from "@/utils/organMatchingUtils";
import ModelInfoBanner from "./organ-matching/ModelInfoBanner";
import ProcessingState from "./organ-matching/ProcessingState";
import InitialState from "./organ-matching/InitialState";
import MatchesCarousel from "./organ-matching/MatchesCarousel";

const OrganMatchingAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
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
      const generatedMatches = generateMatches();
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
          <ModelInfoBanner 
            showModelInfo={showModelInfo} 
            activeModel={activeModel} 
            modelInfo={modelInfo} 
          />
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
          <ProcessingState processingProgress={processingProgress} activeModel={activeModel} />
        ) : matches.length > 0 ? (
          <MatchesCarousel matches={matches} activeModel={activeModel} />
        ) : (
          <InitialState activeModel={activeModel} onRunAnalysis={runAIMatching} />
        )}
      </CardContent>
    </Card>
  );
};

export default OrganMatchingAI;
