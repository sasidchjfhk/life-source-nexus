
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { AlertTriangle, Search, ShieldAlert, CheckCircle2, XCircle, Fingerprint } from "lucide-react";

interface FraudDetectionCardProps {
  onFraudDetected?: (id: string, score: number) => void;
}

const FraudDetectionCard = ({ onFraudDetected }: FraudDetectionCardProps) => {
  const { checkFraudScore, reportFraud } = useWeb3();
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fraudScore, setFraudScore] = useState<number | null>(null);
  const [entityDetails, setEntityDetails] = useState<{
    id: string;
    type: "donor" | "hospital" | "recipient";
    name: string;
    date: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  const detectFraud = async () => {
    if (!searchId.trim()) {
      toast({
        title: "ID Required",
        description: "Please enter an ID to check",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setFraudScore(null);
    setEntityDetails(null);

    try {
      const score = await checkFraudScore(searchId);
      setFraudScore(score);
      
      // Generate mock entity details
      const entityTypes = ["donor", "hospital", "recipient"] as const;
      const randomType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
      
      const names = [
        "John Smith", "Sarah Johnson", "City Medical Center", 
        "James Wilson", "Metro Health", "Emma Davis", 
        "Michael Brown", "Regional Hospital", "Jennifer Lee"
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      // Generate a random date within the last 60 days
      const today = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 60);
      const randomDate = new Date(today);
      randomDate.setDate(today.getDate() - randomDaysAgo);
      const dateString = randomDate.toISOString().split('T')[0];
      
      setEntityDetails({
        id: searchId,
        type: randomType,
        name: randomName,
        date: dateString
      });
      
      if (score > 75 && onFraudDetected) {
        onFraudDetected(searchId, score);
      }
    } catch (error) {
      console.error("Error checking fraud score:", error);
      toast({
        title: "Detection Failed",
        description: "There was an error checking the fraud score. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportFraud = async () => {
    if (!entityDetails) return;
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for reporting fraud",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await reportFraud(entityDetails.id, reason);
      toast({
        title: "Fraud Reported",
        description: `${entityDetails.name} has been reported for potential fraud.`,
      });
      setReason("");
    } catch (error) {
      console.error("Error reporting fraud:", error);
      toast({
        title: "Report Failed",
        description: "There was an error reporting the fraud. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFraudSeverityBadge = (score: number) => {
    if (score >= 75) {
      return <Badge variant="destructive">High Risk</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-orange-500">Medium Risk</Badge>;
    } else if (score >= 25) {
      return <Badge className="bg-yellow-500">Low Risk</Badge>;
    } else {
      return <Badge className="bg-green-500">No Risk</Badge>;
    }
  };

  return (
    <Card className="border border-yellow-200 dark:border-yellow-900">
      <CardHeader className="bg-gradient-to-r from-yellow-100/50 to-transparent dark:from-yellow-900/30 dark:to-transparent">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          <CardTitle>AI Fraud Detection</CardTitle>
        </div>
        <CardDescription>
          ML-powered anomaly detection for suspicious activities
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter donor, recipient, or hospital ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button onClick={detectFraud} disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin">◌</span>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {fraudScore !== null && entityDetails && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-muted">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{entityDetails.name}</h3>
                  {getFraudSeverityBadge(fraudScore)}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">ID:</span> {entityDetails.id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span> {entityDetails.type}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Registered:</span> {entityDetails.date}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fraud Score:</span>{" "}
                    <span className={
                      fraudScore >= 75 ? "text-red-500" :
                      fraudScore >= 50 ? "text-orange-500" :
                      fraudScore >= 25 ? "text-yellow-500" :
                      "text-green-500"
                    }>
                      {fraudScore}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  {fraudScore >= 75 ? (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      AI has detected highly suspicious activity
                    </div>
                  ) : fraudScore >= 50 ? (
                    <div className="flex items-center text-orange-500 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Some suspicious patterns detected
                    </div>
                  ) : (
                    <div className="flex items-center text-green-500 text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      No significant issues detected
                    </div>
                  )}
                </div>
                
                <div className="p-3 rounded-md bg-muted text-xs">
                  <div className="font-semibold mb-1">AI Detection Results:</div>
                  <div className="flex items-center gap-2 mb-1">
                    <Fingerprint className="h-3 w-3" />
                    {fraudScore >= 75 ? (
                      "Multiple inconsistencies detected in submitted data"
                    ) : fraudScore >= 50 ? (
                      "Some data points appear inconsistent with records"
                    ) : (
                      "Data consistency check passed"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="h-3 w-3" />
                    {fraudScore >= 50 ? (
                      "Unusual pattern of blockchain activity detected"
                    ) : (
                      "Normal blockchain activity patterns"
                    )}
                  </div>
                </div>
                
                {fraudScore >= 50 && (
                  <div className="mt-4 space-y-2">
                    <Input
                      placeholder="Reason for reporting fraud"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={handleReportFraud}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>Reporting... <span className="ml-2 animate-spin">◌</span></>
                      ) : (
                        <>Report Fraud</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudDetectionCard;
