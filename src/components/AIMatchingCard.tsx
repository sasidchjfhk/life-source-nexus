
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useWeb3 } from "@/contexts/Web3Context";
import { Dna, Brain, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface AIMatchingCardProps {
  donorId?: string;
  recipientId?: string;
  initialScore?: number;
  showControls?: boolean;
}

const AIMatchingCard = ({ 
  donorId = "D-" + Math.floor(Math.random() * 10000), 
  recipientId = "R-" + Math.floor(Math.random() * 10000),
  initialScore,
  showControls = true
}: AIMatchingCardProps) => {
  const { getOrganMatchScore } = useWeb3();
  const [matchScore, setMatchScore] = useState<number | null>(initialScore || null);
  const [isLoading, setIsLoading] = useState(false);
  const [compatibilityDetails, setCompatibilityDetails] = useState<{
    bloodType: number;
    tissue: number;
    antibody: number;
    age: number;
  }>({
    bloodType: 0,
    tissue: 0,
    antibody: 0,
    age: 0
  });

  const calculateMatch = async () => {
    setIsLoading(true);
    try {
      const score = await getOrganMatchScore(donorId, recipientId);
      setMatchScore(score);
      
      // Generate random compatibility scores that add up close to the overall score
      setCompatibilityDetails({
        bloodType: Math.min(100, Math.max(0, Math.floor(score * 0.8 + Math.random() * 20))),
        tissue: Math.min(100, Math.max(0, Math.floor(score * 0.7 + Math.random() * 30))),
        antibody: Math.min(100, Math.max(0, Math.floor(score * 0.9 + Math.random() * 10))),
        age: Math.min(100, Math.max(0, Math.floor(score * 0.6 + Math.random() * 40)))
      });
    } catch (error) {
      console.error("Error calculating match:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialScore !== undefined) {
      setMatchScore(initialScore);
      
      // Generate random compatibility scores based on initial score
      setCompatibilityDetails({
        bloodType: Math.min(100, Math.max(0, Math.floor(initialScore * 0.8 + Math.random() * 20))),
        tissue: Math.min(100, Math.max(0, Math.floor(initialScore * 0.7 + Math.random() * 30))),
        antibody: Math.min(100, Math.max(0, Math.floor(initialScore * 0.9 + Math.random() * 10))),
        age: Math.min(100, Math.max(0, Math.floor(initialScore * 0.6 + Math.random() * 40)))
      });
    }
  }, [initialScore]);

  const getMatchBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-500">Excellent Match</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-blue-500">Good Match</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-yellow-500">Fair Match</Badge>;
    } else {
      return <Badge className="bg-red-500">Poor Match</Badge>;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="overflow-hidden border-gradient-to-r from-primary/20 to-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle>AI Matching Analysis</CardTitle>
        </div>
        <CardDescription>
          Neural network-powered organ compatibility prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {matchScore === null ? (
          <div className="text-center py-8">
            <Dna className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">AI Match Analysis</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Run AI analysis to see compatibility scores between donor and recipient.
            </p>
            {showControls && (
              <Button 
                className="mt-4"
                onClick={calculateMatch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Analyzing... <span className="ml-2 animate-spin">◌</span></>
                ) : (
                  <>Run AI Analysis</>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-bold mb-2 ${getMatchColor(matchScore)}`}>
                {matchScore}%
              </div>
              <div className="mb-4">
                {getMatchBadge(matchScore)}
              </div>
              <div className="text-sm text-muted-foreground">
                Match between Donor {donorId} and Recipient {recipientId}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Activity className="h-4 w-4" /> Blood Type Compatibility
                  </span>
                  <span className="text-sm text-muted-foreground">{compatibilityDetails.bloodType}%</span>
                </div>
                <Progress value={compatibilityDetails.bloodType} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Dna className="h-4 w-4" /> Tissue Compatibility
                  </span>
                  <span className="text-sm text-muted-foreground">{compatibilityDetails.tissue}%</span>
                </div>
                <Progress value={compatibilityDetails.tissue} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Antibody Cross-Match
                  </span>
                  <span className="text-sm text-muted-foreground">{compatibilityDetails.antibody}%</span>
                </div>
                <Progress value={compatibilityDetails.antibody} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Age Compatibility
                  </span>
                  <span className="text-sm text-muted-foreground">{compatibilityDetails.age}%</span>
                </div>
                <Progress value={compatibilityDetails.age} className="h-2" />
              </div>
            </div>
            
            {showControls && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={calculateMatch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Recalculating... <span className="ml-2 animate-spin">◌</span></>
                ) : (
                  <>Recalculate Match</>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingCard;
